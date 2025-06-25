import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Info, Paperclip, Send } from 'lucide-react';

const Tooltip = ({ text }: { text: string }) => (
  <span className="ml-2 text-xs text-gray-500 cursor-pointer group relative">
    <Info className="inline w-4 h-4" />
    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
      {text}
    </span>
  </span>
);

const userAvatar = (
  <img src="/images/user-avatar.png" alt="User" className="w-10 h-10 rounded-full border-2 border-blue-400 shadow-md bg-white object-cover" />
);
const aiAvatar = (
  <img src="/images/mentor2.png" alt="AI Mentor" className="w-10 h-10 rounded-full border-2 border-purple-400 shadow-md bg-white object-cover" />
);

export function MentorForm({ onClose }: { onClose?: () => void }) {
  const [showChat, setShowChat] = useState(false);
  const [form, setForm] = useState({
    topic: '',
    objectives: '',
    prerequisites: '',
    standards: ''
  });
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build the prompt for the mentor bot
    const prompt = `As an AI tutor for an <<INTJ>> <<visual learner>> with:\n- Strengths: logical, spatial\n- Cognitive profile: high working memory, moderate focus\n- Preferred formats: diagrams + journaling\n- Motivation: mastery + recognition\n- Avoid: auditory-heavy explanations>>\n\nBreak "${form.topic}" into 4 micro-modules with:\n1. Visual concept maps\n2. Logical problem-solving\n3. Spatial representations\n4. Mastery-based challenges\n\nInclude:\n- Estimated duration per module (max 12min)\n- Journal prompts for reflection\n- Error-correction pathways\n\nLearning Objectives:\n${form.objectives}\n\nPrerequisite Knowledge:\n${form.prerequisites}\n\nCurriculum Standards:\n${form.standards}`;
    setMessages([
      { sender: 'user', text: prompt }
    ]);
    setShowChat(true);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    // Here you would send the message to the AI and append the AI's response
    setTimeout(() => {
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'This is a sample AI mentor response. (Integrate with backend for real answers.)' }]);
    }, 1000);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Decorative BG element */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200 rounded-full blur-3xl opacity-60 z-0 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-200 via-purple-100 to-blue-200 rounded-full blur-2xl opacity-50 z-0" />
      {/* Science & Math SVGs - new set */}
      {/* Atom */}
      <svg className="absolute left-10 top-10 w-20 h-20 opacity-50 z-0" viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="32" rx="28" ry="12" stroke="#6366F1" strokeWidth="3" />
        <ellipse cx="32" cy="32" rx="12" ry="28" stroke="#6366F1" strokeWidth="3" />
        <circle cx="32" cy="32" r="4" fill="#6366F1" />
      </svg>
      {/* Rocket */}
      <svg className="absolute right-24 top-24 w-16 h-24 opacity-50 z-0" viewBox="0 0 64 96" fill="none">
        <rect x="28" y="16" width="8" height="40" rx="4" fill="#F59E42" />
        <polygon points="32,8 40,24 24,24" fill="#F59E42" />
        <rect x="28" y="56" width="8" height="16" rx="4" fill="#F59E42" />
      </svg>
      {/* Calculator */}
      <svg className="absolute left-1/2 bottom-16 w-20 h-20 opacity-50 z-0" style={{ transform: 'translateX(-50%)' }} viewBox="0 0 64 64" fill="none">
        <rect x="12" y="12" width="40" height="40" rx="8" fill="#10B981" />
        <rect x="20" y="20" width="8" height="8" fill="#fff" />
        <rect x="36" y="20" width="8" height="8" fill="#fff" />
        <rect x="20" y="36" width="8" height="8" fill="#fff" />
        <rect x="36" y="36" width="8" height="8" fill="#fff" />
      </svg>
      {/* Microscope */}
      <svg className="absolute right-10 bottom-24 w-20 h-20 opacity-50 z-0" viewBox="0 0 64 64" fill="none">
        <rect x="28" y="12" width="8" height="28" rx="4" fill="#6366F1" />
        <rect x="20" y="40" width="24" height="8" rx="4" fill="#6366F1" />
        <circle cx="32" cy="52" r="6" fill="#6366F1" />
      </svg>
      {/* Math Sigma */}
      <svg className="absolute left-16 bottom-32 w-16 h-16 opacity-50 z-0" viewBox="0 0 64 64" fill="none">
        <text x="50%" y="60%" textAnchor="middle" fill="#BE185D" fontSize="48" fontWeight="bold" dy=".3em">Σ</text>
      </svg>
      {/* DNA Double Helix */}
      <svg className="absolute left-32 top-1/2 w-16 h-32 opacity-50 z-0" style={{ transform: 'translateY(-50%)' }} viewBox="0 0 64 128" fill="none">
        <path d="M16 16 Q32 64 16 112" stroke="#0C4A6E" strokeWidth="4" fill="none" />
        <path d="M48 16 Q32 64 48 112" stroke="#0C4A6E" strokeWidth="4" fill="none" />
        <line x1="16" y1="32" x2="48" y2="32" stroke="#0EA5E9" strokeWidth="2" />
        <line x1="16" y1="64" x2="48" y2="64" stroke="#0EA5E9" strokeWidth="2" />
        <line x1="16" y1="96" x2="48" y2="96" stroke="#0EA5E9" strokeWidth="2" />
      </svg>
      {/* Planet with Rings */}
      <svg className="absolute right-40 top-1/2 w-20 h-20 opacity-50 z-0" style={{ transform: 'translateY(-50%)' }} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="12" fill="#FBBF24" />
        <ellipse cx="32" cy="36" rx="20" ry="6" fill="none" stroke="#F59E42" strokeWidth="3" />
      </svg>
      {/* Lightbulb */}
      <svg className="absolute right-10 top-10 w-14 h-14 opacity-50 z-0" viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="28" rx="12" ry="16" fill="#FDE68A" />
        <rect x="28" y="44" width="8" height="10" rx="4" fill="#F59E42" />
        <rect x="30" y="54" width="4" height="6" rx="2" fill="#F59E42" />
      </svg>
      {/* Main UI */}
      <div className={`transition-all duration-700 ease-in-out w-full h-full ${showChat ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`} style={{ position: showChat ? 'absolute' : 'relative', zIndex: 10 }}>
        {!showChat && (
          <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-purple-100 relative z-10 p-4 sm:p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                Mentor Request
              </CardTitle>
              <p className="text-gray-600 mt-1">Fill out the details for your learning module. Your AI mentor will help you craft the perfect lesson!</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Topic */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  Target Topic
                  <Tooltip text="The main topic or concept you want to learn about." />
                </label>
                <Input name="topic" value={form.topic} onChange={handleChange} placeholder="e.g. Quantum Entanglement" className="bg-white/80" />
              </div>
              {/* Learning Objectives */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  Learning Objectives
                  <Tooltip text="What do you want to achieve? List objectives, one per line." />
                </label>
                <Textarea name="objectives" value={form.objectives} onChange={handleChange} rows={3} placeholder="e.g.\nExplain spooky action at distance\nCalculate entanglement probability" className="bg-white/80" />
              </div>
              {/* Prerequisite Knowledge */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  Prerequisite Knowledge
                  <Tooltip text="What should the learner already know? List prerequisites, one per line." />
                </label>
                <Textarea name="prerequisites" value={form.prerequisites} onChange={handleChange} rows={2} placeholder="e.g.\nbasic quantum mechanics\nlinear algebra" className="bg-white/80" />
              </div>
              {/* Curriculum Standards */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  Curriculum Standards
                  <Tooltip text="Any standards or frameworks to align with?" />
                </label>
                <Input name="standards" value={form.standards} onChange={handleChange} placeholder="e.g. Next Generation Science Standards HS-PS4-3" className="bg-white/80" />
              </div>
              <div className="pt-2 flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow">
                  Send to Mentor
                </Button>
              </div>
            </CardContent>
          </form>
        )}
      </div>
      {/* Chat UI */}
      {showChat && (
        <div className="absolute inset-0 w-full h-full flex flex-col z-20 transition-all duration-700 ease-in-out opacity-100 scale-100">
          {/* Chat header */}
          <div className="w-full flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg z-30">
            <div className="flex items-center gap-3">
              <img src="/images/mentor2.png" alt="AI Mentor" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-400 shadow-md bg-white object-cover" />
              <span className="text-white text-lg sm:text-2xl font-bold tracking-wide drop-shadow">AI Mentor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-xs sm:text-sm font-medium">Advanced Learning Assistant</span>
              <button
                type="button"
                className="ml-4 px-3 py-1 rounded bg-white/20 hover:bg-white/40 text-white font-semibold text-sm transition"
                onClick={() => setShowChat(false)}
              >
                Back
              </button>
            </div>
          </div>
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-8 flex flex-col gap-4 sm:gap-6 max-h-[calc(100vh-120px)] min-h-0 pb-40" style={{ minHeight: 0 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end w-full`}>
                {msg.sender === 'ai' && (
                  <div className="mr-2 sm:mr-3">{aiAvatar}</div>
                )}
                <div className={`relative max-w-[90vw] sm:max-w-xl px-4 sm:px-6 py-3 sm:py-4 rounded-3xl shadow-xl text-base font-medium transition-all
                  ${msg.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-br-2xl rounded-tr-3xl animate-fade-in-right'
                    : 'bg-gradient-to-br from-purple-200 to-pink-200 text-gray-900 rounded-bl-2xl rounded-tl-3xl animate-fade-in-left'}
                `}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="ml-2 sm:ml-3">{userAvatar}</div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* Chat input */}
          <div className="w-full flex justify-center z-40 fixed bottom-0 left-0 pointer-events-none">
            <form onSubmit={handleSend} className="w-full max-w-3xl flex flex-row items-end gap-3 bg-white/95 rounded-2xl shadow-2xl px-4 py-3 mx-auto border border-gray-200 pointer-events-auto">
              {/* Attachment button (future) */}
              <button type="button" disabled className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition" title="Attach file (coming soon)">
                <Paperclip className="w-5 h-5" />
              </button>
              {/* Multiline input */}
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                rows={1}
                maxLength={1000}
                className="flex-1 resize-none bg-white rounded-xl px-5 py-4 text-lg sm:text-xl shadow-none border border-gray-200 focus:ring-2 focus:ring-blue-400 min-h-[48px] max-h-40 text-left transition placeholder-gray-400"
                style={{ minHeight: '48px', maxHeight: '160px', overflowY: 'auto' }}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '48px';
                  target.style.height = Math.min(target.scrollHeight, 160) + 'px';
                }}
              />
              {/* Send button */}
              <button
                type="submit"
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!input.trim()}
                title="Send"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Back button for mentor request form */}
      {!showChat && (
        <button
          type="button"
          className="absolute top-4 left-4 px-4 py-2 rounded bg-white/80 hover:bg-white text-blue-700 font-semibold shadow z-20"
          onClick={() => (onClose ? onClose() : window.history.back())}
        >
          Back
        </button>
      )}
    </div>
  );
}

// Add animation for chat bubble
// In your global CSS (e.g., globals.css), add:
// @keyframes fade-in-right { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
// @keyframes fade-in-left { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
// .animate-fade-in-right { animation: fade-in-right 0.5s ease; }
// .animate-fade-in-left { animation: fade-in-left 0.5s ease; } 