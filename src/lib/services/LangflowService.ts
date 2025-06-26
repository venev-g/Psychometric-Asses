export interface LangflowResponse {
  result: {
    text: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Session {
  id: string;
  name: string;
  topic: string;
  createdAt: Date;
  lastMessageAt: Date;
  messageCount: number;
}

export class LangflowService {
  private static readonly API_URL = process.env.NEXT_PUBLIC_LANGFLOW_API_URL || "https://e3d4-2409-40c0-105a-d42-80a7-f3bf-2c80-4902.ngrok-free.app/api/v1/run/8fd4743e-77c0-4ce1-9332-2ddbeda3851b";
  private static readonly SESSIONS_KEY = 'langflow_sessions';
  
  // Get all sessions from localStorage
  static getSessions(): Session[] {
    if (typeof window === 'undefined') return [];
    try {
      const sessions = localStorage.getItem(this.SESSIONS_KEY);
      return sessions ? JSON.parse(sessions).map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        lastMessageAt: new Date(s.lastMessageAt)
      })) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  // Save sessions to localStorage
  private static saveSessions(sessions: Session[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }

  // Create a new session
  static createSession(topic: string, name?: string): Session {
    const sessions = this.getSessions();
    const newSession: Session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name || `Session ${sessions.length + 1}`,
      topic,
      createdAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0
    };
    
    sessions.unshift(newSession); // Add to beginning
    this.saveSessions(sessions);
    return newSession;
  }

  // Update session
  static updateSession(sessionId: string, updates: Partial<Session>): void {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      this.saveSessions(sessions);
    }
  }

  // Delete session
  static deleteSession(sessionId: string): void {
    const sessions = this.getSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    this.saveSessions(filteredSessions);
  }

  // Get session by ID
  static getSession(sessionId: string): Session | undefined {
    return this.getSessions().find(s => s.id === sessionId);
  }
  
  static async sendMessage(message: string, sessionId?: string): Promise<string> {
    try {
      // Debug: Log the API URL being used
      console.log('LangflowService: Using API URL:', this.API_URL);
      console.log('LangflowService: Environment variable value:', process.env.NEXT_PUBLIC_LANGFLOW_API_URL);

      const payload = {
        input_value: message,
        output_type: "chat",
        input_type: "chat",
        session_id: sessionId || "default" // Add session ID to payload
      };

      const headers = {
        "Content-Type": "application/json"
      };

      console.log('Sending message to Langflow API:', { url: this.API_URL, payload });

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data: LangflowResponse = await response.json();
      console.log('Langflow API response:', data);
      console.log('Full response data:', JSON.stringify(data, null, 2));
      
      // Update session message count and last message time
      if (sessionId) {
        const session = this.getSession(sessionId);
        if (session) {
          this.updateSession(sessionId, {
            messageCount: session.messageCount + 1,
            lastMessageAt: new Date()
          });
        }
      }
      
      // 0. Try to extract from outputs[0].outputs[0].results.message.data.text
      let responseText = '';
      try {
        if (
          data.outputs &&
          Array.isArray(data.outputs) &&
          data.outputs[0] &&
          data.outputs[0].outputs &&
          Array.isArray(data.outputs[0].outputs) &&
          data.outputs[0].outputs[0] &&
          data.outputs[0].outputs[0].results &&
          data.outputs[0].outputs[0].results.message &&
          data.outputs[0].outputs[0].results.message.data &&
          typeof data.outputs[0].outputs[0].results.message.data.text === 'string'
        ) {
          responseText = data.outputs[0].outputs[0].results.message.data.text;
        }
      } catch (e) {
        // ignore, fallback to other logic
      }
      // If not found, fallback to previous logic
      if (!responseText) {
        // 1. If result.text exists and is a long string, use it
        if (data.result && typeof data.result.text === 'string' && data.result.text.length > 20) {
          responseText = data.result.text;
        }
        // 2. If result.text is an array, join it
        else if (data.result && Array.isArray(data.result.text)) {
          responseText = data.result.text.join('\n');
        }
        // 3. If result is an array, join all text fields
        else if (Array.isArray(data.result)) {
          responseText = data.result.map((item: any) => item.text || JSON.stringify(item)).join('\n');
        }
        // 4. If result is a string
        else if (typeof data.result === 'string') {
          responseText = data.result;
        }
        // 5. If data.text exists
        else if (data.text) {
          responseText = data.text;
        }
        // 6. If data.message exists
        else if (data.message) {
          responseText = data.message;
        }
        // 7. If data.content exists
        else if (data.content) {
          responseText = data.content;
        }
        // 8. If data.output exists
        else if (data.output) {
          responseText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
        }
        // 9. If data.response exists
        else if (data.response) {
          responseText = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
        }
        // 10. Fallback: try to find any text field in the response
        else {
          const responseString = JSON.stringify(data);
          console.log('Searching for text in response:', responseString);
          // Look for common text patterns
          const textPatterns = [
            /"text":\s*"([^"]+)"/g,
            /"message":\s*"([^"]+)"/g,
            /"content":\s*"([^"]+)"/g,
            /"output":\s*"([^"]+)"/g,
            /"response":\s*"([^"]+)"/g
          ];
          for (const pattern of textPatterns) {
            const matches = responseString.match(pattern);
            if (matches && matches[1]) {
              responseText = matches[1];
              break;
            }
          }
          // If still no text found, return the full response for debugging
          if (!responseText) {
            console.warn('Could not extract text from response, returning full response for debugging');
            return `[DEBUG] Full response: ${JSON.stringify(data, null, 2)}`;
          }
        }
      }
      // If the extracted text is suspiciously short, show the full response for debugging
      if (responseText.length < 30) {
        return `[DEBUG] Full response: ${JSON.stringify(data, null, 2)}`;
      }
      console.log('Extracted response text:', responseText);
      console.log('Response text length:', responseText.length);
      return responseText;
    } catch (error) {
      console.error("Error calling Langflow API:", error);
      throw new Error(`Failed to get response from AI mentor: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async sendMentorRequest(formData: {
    topic: string;
    objectives: string;
    prerequisites: string;
    standards: string;
  }, sessionId?: string): Promise<string> {
    const prompt = `Suggest 4 simple learning steps for "${formData.topic}".

Learning Objectives: ${formData.objectives}
Prerequisite Knowledge: ${formData.prerequisites}
Curriculum Standards: ${formData.standards}

Keep it concise and easy for a beginner.`;

    return this.sendMessage(prompt, sessionId);
  }
} 