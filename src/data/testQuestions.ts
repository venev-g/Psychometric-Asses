
export interface TestQuestion {
  id: number;
  text: string;
  testType: 'dominant' | 'personality' | 'learning';
  part?: number;
  category: string;
  options?: string[]; // For dynamic learning style questions
}

export interface TestResponse {
  questionId: number;
  question: string;
  response: number | string;
  testType: 'dominant' | 'personality' | 'learning';
  part?: number;
  category: string;
}

export interface PersonalityType {
  code: string;
  title: string;
  summary: string;
  character: string;
}

export const personalityTypes: PersonalityType[] = [
  { code: 'INTJ', title: 'Reflective Strategist', summary: 'Quiet thinker, loves systems, goals, and improving things with logic.', character: '🧠' },
  { code: 'INTP', title: 'Curious Architect', summary: 'Independent problem-solver, thrives on puzzles and novel concepts.', character: '🔍' },
  { code: 'INFJ', title: 'Visionary Mentor', summary: 'Quietly idealistic, blends deep empathy with future-focused thinking.', character: '🌟' },
  { code: 'INFP', title: 'Empathetic Innovator', summary: 'Values authenticity, imaginative, and emotionally insightful.', character: '🎨' },
  { code: 'ISTJ', title: 'Structured Analyst', summary: 'Practical, reliable, loves order and detailed work.', character: '📋' },
  { code: 'ISFJ', title: 'Supportive Organizer', summary: 'Loyal, calm, people-oriented, keeps systems and relationships in harmony.', character: '🤝' },
  { code: 'ISTP', title: 'Tactical Builder', summary: 'Hands-on, analytical, loves to tinker, fix, and prototype.', character: '🔧' },
  { code: 'ISFP', title: 'Gentle Creator', summary: 'Artistic, kind, curious, and learns through sensory experience.', character: '🌸' },
  { code: 'ENTJ', title: 'Bold Visionary', summary: 'Natural leader, strategic planner, driven to accomplish big ideas.', character: '👑' },
  { code: 'ENTP', title: 'Inventive Debater', summary: 'Enthusiastic, loves challenges, enjoys rapid ideation and sparring of ideas.', character: '💡' },
  { code: 'ENFJ', title: 'Expressive Leader', summary: 'Charismatic, values-driven, and thrives in people-centric growth environments.', character: '🌅' },
  { code: 'ENFP', title: 'Dynamic Explorer', summary: 'Energetic, curious, and inspired by new ideas and connecting people.', character: '🚀' },
  { code: 'ESTJ', title: 'Action-Oriented Planner', summary: 'Results-focused, structured, and likes clarity, control, and productivity.', character: '⚡' },
  { code: 'ESFJ', title: 'Reliable Harmonizer', summary: 'Warm, organized, and creates stability through care and community.', character: '☀️' },
  { code: 'ESTP', title: 'Bold Executor', summary: 'Fast, pragmatic, loves action, and learns best by doing.', character: '🎯' },
  { code: 'ESFP', title: 'Adaptive Explorer', summary: 'Fun-loving, spontaneous, people-focused, and thrives in active group learning.', character: '🎭' }
];

// Test 1: Dominant Intelligence (Reduced to 24 questions)
export const dominantIntelligenceQuestions: TestQuestion[] = [
  // Part 1: Problem Solving (8 questions)
  { id: 1, text: "I enjoy solving complex mathematical problems and puzzles.", testType: 'dominant', part: 1, category: "Logical Intelligence" },
  { id: 2, text: "I can easily see patterns in numbers and sequences.", testType: 'dominant', part: 1, category: "Logical Intelligence" },
  { id: 3, text: "I have a strong vocabulary and enjoy learning new words.", testType: 'dominant', part: 1, category: "Linguistic Intelligence" },
  { id: 4, text: "I express myself clearly through writing and speaking.", testType: 'dominant', part: 1, category: "Linguistic Intelligence" },
  { id: 5, text: "I can easily visualize objects in three dimensions.", testType: 'dominant', part: 1, category: "Spatial Intelligence" },
  { id: 6, text: "I rarely get lost when navigating new places.", testType: 'dominant', part: 1, category: "Spatial Intelligence" },
  { id: 7, text: "I prefer logical, step-by-step approaches to problem-solving.", testType: 'dominant', part: 1, category: "Logical Intelligence" },
  { id: 8, text: "I enjoy reading books and prefer visual presentations.", testType: 'dominant', part: 1, category: "Linguistic Intelligence" },

  // Part 2: Social Intelligence (8 questions)
  { id: 9, text: "I easily understand other people's emotions and feelings.", testType: 'dominant', part: 2, category: "Interpersonal Intelligence" },
  { id: 10, text: "I work well in group settings and team projects.", testType: 'dominant', part: 2, category: "Interpersonal Intelligence" },
  { id: 11, text: "I have a clear understanding of my own strengths and weaknesses.", testType: 'dominant', part: 2, category: "Intrapersonal Intelligence" },
  { id: 12, text: "I regularly reflect on my thoughts and feelings.", testType: 'dominant', part: 2, category: "Intrapersonal Intelligence" },
  { id: 13, text: "I can clearly express my ideas in conversations.", testType: 'dominant', part: 2, category: "Communication Skills" },
  { id: 14, text: "I am comfortable speaking in front of groups.", testType: 'dominant', part: 2, category: "Communication Skills" },
  { id: 15, text: "I naturally take on leadership roles in group situations.", testType: 'dominant', part: 2, category: "Interpersonal Intelligence" },
  { id: 16, text: "I can manage my emotions effectively in challenging situations.", testType: 'dominant', part: 2, category: "Intrapersonal Intelligence" },

  // Part 3: Creative Intelligence (8 questions)
  { id: 17, text: "I learn better when I can move around or use my hands.", testType: 'dominant', part: 3, category: "Bodily-Kinesthetic Intelligence" },
  { id: 18, text: "I have good coordination and enjoy physical activities.", testType: 'dominant', part: 3, category: "Bodily-Kinesthetic Intelligence" },
  { id: 19, text: "I have a good sense of rhythm and can recognize musical patterns.", testType: 'dominant', part: 3, category: "Musical Intelligence" },
  { id: 20, text: "Music helps me concentrate and learn better.", testType: 'dominant', part: 3, category: "Musical Intelligence" },
  { id: 21, text: "I notice and appreciate patterns in nature.", testType: 'dominant', part: 3, category: "Naturalistic Intelligence" },
  { id: 22, text: "I enjoy spending time outdoors and in natural settings.", testType: 'dominant', part: 3, category: "Naturalistic Intelligence" },
  { id: 23, text: "I come up with original and creative solutions to problems.", testType: 'dominant', part: 3, category: "Creative Intelligence" },
  { id: 24, text: "I like to approach tasks in new and innovative ways.", testType: 'dominant', part: 3, category: "Creative Intelligence" }
];

// Test 2: Personality Pattern (Reduced to 16 questions)
export const personalityPatternQuestions: TestQuestion[] = [
  { id: 25, text: "I get energized by being around other people and social situations.", testType: 'personality', category: "Extraversion vs Introversion" },
  { id: 26, text: "I prefer to think things through quietly before speaking.", testType: 'personality', category: "Extraversion vs Introversion" },
  { id: 27, text: "I like to focus on concrete facts and details.", testType: 'personality', category: "Sensing vs Intuition" },
  { id: 28, text: "I prefer to focus on patterns, possibilities, and meanings.", testType: 'personality', category: "Sensing vs Intuition" },
  { id: 29, text: "I make decisions based on logical analysis and objective criteria.", testType: 'personality', category: "Thinking vs Feeling" },
  { id: 30, text: "I make decisions based on personal values and how they affect people.", testType: 'personality', category: "Thinking vs Feeling" },
  { id: 31, text: "I prefer to have things decided and settled with clear plans.", testType: 'personality', category: "Judging vs Perceiving" },
  { id: 32, text: "I prefer to keep my options open and adapt as I go.", testType: 'personality', category: "Judging vs Perceiving" },
  { id: 33, text: "I enjoy being the center of attention in social situations.", testType: 'personality', category: "Extraversion vs Introversion" },
  { id: 34, text: "I need quiet time alone to recharge my energy.", testType: 'personality', category: "Extraversion vs Introversion" },
  { id: 35, text: "I trust information that comes from direct experience.", testType: 'personality', category: "Sensing vs Intuition" },
  { id: 36, text: "I trust my hunches and gut feelings about situations.", testType: 'personality', category: "Sensing vs Intuition" },
  { id: 37, text: "I can easily set aside personal feelings to make tough decisions.", testType: 'personality', category: "Thinking vs Feeling" },
  { id: 38, text: "I value harmony and try to avoid conflict.", testType: 'personality', category: "Thinking vs Feeling" },
  { id: 39, text: "I feel comfortable when things are organized and structured.", testType: 'personality', category: "Judging vs Perceiving" },
  { id: 40, text: "I work well under pressure and close to deadlines.", testType: 'personality', category: "Judging vs Perceiving" }
];

// Test 3: Learning Style (Dynamic questions with options)
export const learningStyleQuestions: TestQuestion[] = [
  { 
    id: 41, 
    text: "When learning something new, which approach works best for you?", 
    testType: 'learning', 
    category: "Learning Preference",
    options: [
      "Looking at diagrams, charts, and visual aids",
      "Listening to explanations and discussions", 
      "Reading detailed notes and written materials",
      "Doing hands-on activities and experiments"
    ]
  },
  { 
    id: 42, 
    text: "How do you prefer to receive instructions?", 
    testType: 'learning', 
    category: "Information Processing",
    options: [
      "Through visual demonstrations and pictures",
      "Through verbal explanations and audio",
      "Through written step-by-step guides",
      "Through physical practice and trial"
    ]
  },
  { 
    id: 43, 
    text: "What helps you remember information best?", 
    testType: 'learning', 
    category: "Memory Style",
    options: [
      "Creating colorful mind maps and diagrams",
      "Discussing and talking about the topic",
      "Writing detailed notes and summaries", 
      "Acting out or physically practicing"
    ]
  },
  { 
    id: 44, 
    text: "In a classroom setting, you learn best when:", 
    testType: 'learning', 
    category: "Learning Environment",
    options: [
      "There are plenty of visual aids and presentations",
      "There's lots of discussion and group interaction",
      "You can take detailed notes and read materials",
      "You can do experiments and hands-on activities"
    ]
  },
  { 
    id: 45, 
    text: "When studying for an exam, you prefer to:", 
    testType: 'learning', 
    category: "Study Method",
    options: [
      "Use highlighters, charts, and visual organizers",
      "Study with others and explain concepts aloud",
      "Read through notes multiple times",
      "Create flashcards and practice actively"
    ]
  },
  { 
    id: 46, 
    text: "Which type of content do you find most engaging?", 
    testType: 'learning', 
    category: "Content Preference",
    options: [
      "Videos, infographics, and visual presentations",
      "Podcasts, lectures, and audio content",
      "Articles, books, and written materials",
      "Interactive simulations and games"
    ]
  }
];

export const testQuestions = dominantIntelligenceQuestions;
