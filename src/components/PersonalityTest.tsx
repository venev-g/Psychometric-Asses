import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Bot, User, Brain, Users, BookOpen, LogOut, Calculator, Atom, Palette, BarChart3, Eye, Sparkles, Zap, Target, Trophy, Star, Lightbulb, Heart, Music, Camera, Globe } from 'lucide-react';
import { 
  dominantIntelligenceQuestions, 
  personalityPatternQuestions, 
  learningStyleQuestions,
  TestResponse
} from '@/data/testQuestions';
import TestResults from '@/components/TestResults';
import DominantIntelligenceReport from '@/components/DominantIntelligenceReport';
import PersonalityReport from '@/components/PersonalityReport';
import LearningStyleReport from '@/components/LearningStyleReport';
import PartFeedback from '@/components/PartFeedback';

interface PersonalityTestProps {
  onBack: () => void;
}

type TestType = 'dominant' | 'personality' | 'learning';
type TestPhase = 'testing' | 'partComplete' | 'testComplete' | 'dominantReport' | 'personalityReport' | 'learningReport' | 'finalReport';

type ChatMessage = {
  type: 'bot' | 'user' | 'options' | 'dynamicOptions' | 'testActions' | 'macroFeedback';
  content: string;
  options?: Array<{value: number, label: string}>;
  dynamicOptions?: string[];
  testType?: TestType;
  completedTest?: TestType;
  completedPart?: number;
  feedbackType?: 'part' | 'test';
};

const PersonalityTest = ({ onBack }: PersonalityTestProps) => {
  const [currentTest, setCurrentTest] = useState<TestType>('dominant');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<TestResponse[]>([]);
  const [phase, setPhase] = useState<TestPhase>('testing');
  const [selectedResponse, setSelectedResponse] = useState<number | string | null>(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [completedPart, setCompletedPart] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      type: 'bot', 
      content: `Hey there! 👋 I'm your AI assessment companion. We're going to explore your unique strengths through 3 exciting tests:

🧠 **Test 1: Dominant Intelligence** - Discover your natural talents (12 questions)
👥 **Test 2: Personality Pattern** - Understand your character type (8 questions)
📚 **Test 3: Learning Style** - Find your optimal learning approach (4 questions)

Let's start with your Dominant Intelligence assessment. Ready to dive in?`
    }
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  const responseOptions = [
    { value: 5, label: 'Strongly Agree' },
    { value: 4, label: 'Agree' },
    { value: 3, label: 'Neutral' },
    { value: 2, label: 'Disagree' },
    { value: 1, label: 'Strongly Disagree' }
  ];

  const getCurrentQuestions = () => {
    switch (currentTest) {
      case 'dominant': return dominantIntelligenceQuestions;
      case 'personality': return personalityPatternQuestions;
      case 'learning': return learningStyleQuestions;
    }
  };

  const getTestIcon = (test: TestType) => {
    switch (test) {
      case 'dominant': return Brain;
      case 'personality': return Users;
      case 'learning': return BookOpen;
    }
  };

  const getTestTitle = (test: TestType) => {
    switch (test) {
      case 'dominant': return 'Dominant Intelligence';
      case 'personality': return 'Personality Pattern';
      case 'learning': return 'Learning Style';
    }
  };

  const scrollToQuestion = () => {
    setTimeout(() => {
      questionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage?.type === 'options' || lastMessage?.type === 'dynamicOptions') {
      scrollToQuestion();
    } else {
      scrollToBottom();
    }
  }, [chatMessages]);

  const showMacroFeedback = (type: 'part' | 'test', completedPart?: number, completedTest?: TestType) => {
    let feedbackContent = '';
    let emoji = '';
    
    if (type === 'part') {
      const partNames = { 1: 'Problem Solving', 2: 'Social Intelligence', 3: 'Creative Intelligence' };
      const partName = partNames[completedPart as keyof typeof partNames];
      emoji = completedPart === 1 ? '🧠' : completedPart === 2 ? '👥' : '🎨';
      feedbackContent = `${emoji} **Amazing Progress!** ${emoji}

You've successfully completed **Part ${completedPart}: ${partName}**! 

✨ Your mind is truly fascinating - each response reveals unique patterns in how you think and process information.

🌟 **What's happening behind the scenes:**
- Your responses are being analyzed for cognitive patterns
- We're mapping your intellectual strengths
- Building your personalized intelligence profile

Keep up the fantastic work! 🚀`;
    } else {
      const testNames = {
        dominant: { name: 'Dominant Intelligence', emoji: '🧠', color: 'blue' },
        personality: { name: 'Personality Pattern', emoji: '👥', color: 'purple' },
        learning: { name: 'Learning Style', emoji: '📚', color: 'green' }
      };
      const testInfo = testNames[completedTest!];
      feedbackContent = `${testInfo.emoji} **Incredible Achievement!** ${testInfo.emoji}

🎉 You've completed the **${testInfo.name}** assessment! 

🌈 **What you've accomplished:**
- Revealed deep insights about your cognitive style
- Unlocked understanding of your unique strengths  
- Added valuable data to your personal profile

💫 Your journey of self-discovery is expanding with each test! The patterns emerging will help you understand yourself better than ever before.

Ready for what's next? 🚀✨`;
    }

    setChatMessages(prev => [...prev, {
      type: 'macroFeedback',
      content: feedbackContent,
      feedbackType: type,
      completedPart,
      completedTest
    }]);
  };

  const handleQuit = () => {
    const completedDominantParts = [...new Set(responses.filter(r => r.testType === 'dominant').map(r => r.part))];
    const hasPersonalityResponses = responses.some(r => r.testType === 'personality');
    const hasLearningResponses = responses.some(r => r.testType === 'learning');

    if (completedDominantParts.length > 0 || hasPersonalityResponses || hasLearningResponses) {
      setPhase('finalReport');
    } else {
      onBack();
    }
  };

  const handleResponse = (value: number | string) => {
    const questions = getCurrentQuestions();
    const question = questions[currentQuestion];
    const newResponse: TestResponse = {
      questionId: question.id,
      question: question.text,
      response: value,
      testType: currentTest,
      part: question.part,
      category: question.category
    };

    setResponses([...responses, newResponse]);
    setSelectedResponse(null);
    
    const responseLabel = typeof value === 'number' 
      ? responseOptions.find(opt => opt.value === value)?.label || '' 
      : value;
    setChatMessages(prev => [...prev, { type: 'user', content: `Selected: ${responseLabel}` }]);

    const nextQuestion = currentQuestion + 1;
    
    if (currentTest === 'dominant') {
      const isPartComplete = !questions.slice(nextQuestion).some(q => q.part === question.part);

      if (isPartComplete && nextQuestion < questions.length) {
        setTimeout(() => {
          showMacroFeedback('part', question.part!);
          setTimeout(() => {
            showPartCompletionOptions(question.part!);
          }, 3000);
        }, 1000);
      } else if (nextQuestion >= questions.length) {
        setTimeout(() => {
          showMacroFeedback('test', undefined, currentTest);
          setTimeout(() => {
            showTestCompletionOptions('dominant');
          }, 3000);
        }, 1000);
      } else {
        continueToNextQuestion(nextQuestion);
      }
    } else {
      if (nextQuestion >= questions.length) {
        setTimeout(() => {
          showMacroFeedback('test', undefined, currentTest);
          setTimeout(() => {
            showTestCompletionOptions(currentTest);
          }, 3000);
        }, 1000);
      } else {
        continueToNextQuestion(nextQuestion);
      }
    }
  };

  const showPartCompletionOptions = (completedPart: number) => {
    const partNames = { 1: 'Problem Solving', 2: 'Social Intelligence', 3: 'Creative Intelligence' };
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: `🎉 Excellent work! You've completed Part ${completedPart}: ${partNames[completedPart as keyof typeof partNames]}.

What would you like to do next?`
      }, {
        type: 'testActions',
        content: '',
        completedPart: completedPart
      }]);
    }, 1000);
  };

  const showTestCompletionOptions = (completedTest: TestType) => {
    const testNames = {
      dominant: 'Dominant Intelligence',
      personality: 'Personality Pattern', 
      learning: 'Learning Style'
    };

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: `🌟 Fantastic! You've completed the ${testNames[completedTest]} test!

What would you like to do next?`
      }, {
        type: 'testActions',
        content: '',
        completedTest: completedTest
      }]);
    }, 1000);
  };

  const continueToNextPart = (fromPart: number) => {
    const nextPartName = { 1: 'Social Intelligence', 2: 'Creative Intelligence' }[fromPart as 1 | 2];
    
    setChatMessages(prev => [...prev, {
      type: 'bot',
      content: `Great! Let's continue to Part ${fromPart + 1}: ${nextPartName}. Ready?`
    }]);
    
    setTimeout(() => {
      const nextQuestionIndex = dominantIntelligenceQuestions.findIndex(q => q.part === fromPart + 1);
      setCurrentQuestion(nextQuestionIndex);
      const nextQ = dominantIntelligenceQuestions[nextQuestionIndex];
      setChatMessages(prev => [...prev, 
        { type: 'bot', content: nextQ.text },
        { type: 'options', content: '', testType: 'dominant' }
      ]);
    }, 1500);
  };

  const continueToNextQuestion = (nextQuestionIndex: number) => {
    setCurrentQuestion(nextQuestionIndex);
    setTimeout(() => {
      const questions = getCurrentQuestions();
      const nextQ = questions[nextQuestionIndex];
      
      if (currentTest === 'learning' && nextQ.options) {
        setChatMessages(prev => [...prev, 
          { type: 'bot', content: nextQ.text },
          { type: 'dynamicOptions', content: '', dynamicOptions: nextQ.options, testType: currentTest }
        ]);
      } else {
        setChatMessages(prev => [...prev, 
          { type: 'bot', content: nextQ.text },
          { type: 'options', content: '', testType: currentTest }
        ]);
      }
    }, 800);
  };

  const continueFromReport = (nextTest: TestType) => {
    setCurrentTest(nextTest);
    setCurrentQuestion(0);
    setPhase('testing');
    
    setTimeout(() => {
      const testIntros = {
        personality: `Excellent work! 🎉 Now let's explore your Personality Pattern with our mini-MBTI assessment.`,
        learning: `Fantastic! 🌟 Now for our final assessment - your Learning Style using the VARK model.`
      };
      
      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: testIntros[nextTest]
      }]);
      
      setTimeout(() => {
        const questions = nextTest === 'personality' ? personalityPatternQuestions : learningStyleQuestions;
        const nextQ = questions[0];
        
        if (nextTest === 'learning' && nextQ.options) {
          setChatMessages(prev => [...prev, 
            { type: 'bot', content: nextQ.text },
            { type: 'dynamicOptions', content: '', dynamicOptions: nextQ.options, testType: nextTest }
          ]);
        } else {
          setChatMessages(prev => [...prev, 
            { type: 'bot', content: nextQ.text },
            { type: 'options', content: '', testType: nextTest }
          ]);
        }
      }, 1500);
    }, 1000);
  };

  const getTotalQuestions = () => {
    return dominantIntelligenceQuestions.length + personalityPatternQuestions.length + learningStyleQuestions.length;
  };

  const getCurrentProgress = () => {
    let completedQuestions = responses.length;
    return (completedQuestions / getTotalQuestions()) * 100;
  };

  const getCurrentQuestionNumber = () => {
    return responses.length + 1;
  };

  useEffect(() => {
    if (dominantIntelligenceQuestions[0] && chatMessages.length === 1) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, 
          { type: 'bot', content: dominantIntelligenceQuestions[0].text },
          { type: 'options', content: '', testType: 'dominant' }
        ]);
      }, 2000);
    }
  }, []);

  if (phase === 'partComplete') {
    return <PartFeedback part={completedPart!} responses={responses} onContinue={() => setPhase('dominantReport')} />;
  }
  
  if (phase === 'testComplete') {
    return <PartFeedback part={completedPart!} responses={responses} onContinue={() => setPhase('dominantReport')} />;
  }
  
  if (phase === 'dominantReport') {
    return <DominantIntelligenceReport responses={responses} onContinue={() => continueFromReport('personality')} />;
  }
  
  if (phase === 'personalityReport') {
    return <PersonalityReport responses={responses} onContinue={() => continueFromReport('learning')} />;
  }
  
  if (phase === 'learningReport') {
    return <LearningStyleReport responses={responses} onContinue={() => setPhase('finalReport')} />;
  }
  
  if (phase === 'finalReport') {
    return <TestResults responses={responses} onRestart={onBack} />;
  }

  const TestIcon = getTestIcon(currentTest);

  const getBackgroundElements = () => {
    if (currentTest === 'dominant') {
      return (
        <>
          <Calculator className="absolute top-24 left-16 w-6 h-6 text-blue-300 opacity-30 animate-float z-10" />
          <Brain className="absolute top-40 right-20 w-8 h-8 text-purple-300 opacity-30 animate-pulse z-10" />
          <Atom className="absolute bottom-60 left-12 w-7 h-7 text-indigo-300 opacity-30 animate-spin-slow z-10" />
          <Calculator className="absolute bottom-32 right-16 w-5 h-5 text-blue-200 opacity-20 animate-bounce z-10" />
          <Lightbulb className="absolute top-60 left-24 w-6 h-6 text-yellow-300 opacity-25 animate-pulse z-10" />
          <Target className="absolute bottom-48 right-32 w-5 h-5 text-green-300 opacity-30 animate-float z-10" />
          <Zap className="absolute top-32 right-40 w-4 h-4 text-orange-300 opacity-25 animate-bounce z-10" />
          <Sparkles className="absolute bottom-20 left-32 w-6 h-6 text-pink-300 opacity-30 animate-pulse z-10" />
        </>
      );
    } else if (currentTest === 'personality') {
      return (
        <>
          <Users className="absolute top-32 right-20 w-7 h-7 text-pink-300 opacity-30 animate-bounce z-10" />
          <Users className="absolute bottom-48 left-20 w-6 h-6 text-purple-300 opacity-30 animate-pulse z-10" />
          <Brain className="absolute top-60 left-16 w-6 h-6 text-indigo-300 opacity-25 animate-float z-10" />
          <Heart className="absolute top-44 left-32 w-5 h-5 text-red-300 opacity-30 animate-pulse z-10" />
          <Star className="absolute bottom-32 right-24 w-6 h-6 text-yellow-300 opacity-25 animate-float z-10" />
          <Trophy className="absolute top-20 right-32 w-5 h-5 text-gold-300 opacity-30 animate-bounce z-10" />
          <Globe className="absolute bottom-60 left-40 w-4 h-4 text-blue-300 opacity-25 animate-spin-slow z-10" />
        </>
      );
    } else {
      return (
        <>
          <BookOpen className="absolute top-28 left-20 w-7 h-7 text-green-300 opacity-30 animate-float z-10" />
          <Palette className="absolute bottom-52 right-24 w-6 h-6 text-blue-300 opacity-30 animate-pulse z-10" />
          <BookOpen className="absolute bottom-28 left-16 w-5 h-5 text-emerald-200 opacity-25 animate-bounce z-10" />
          <Music className="absolute top-36 right-28 w-5 h-5 text-purple-300 opacity-30 animate-float z-10" />
          <Camera className="absolute bottom-40 left-28 w-6 h-6 text-orange-300 opacity-25 animate-pulse z-10" />
          <Eye className="absolute top-52 left-36 w-4 h-4 text-indigo-300 opacity-30 animate-bounce z-10" />
          <Sparkles className="absolute bottom-16 right-20 w-5 h-5 text-pink-300 opacity-25 animate-float z-10" />
        </>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-roboto overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {getBackgroundElements()}
      </div>

      <div className="flex flex-col h-full relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowQuitConfirm(true)}
              className="flex items-center text-red-600 hover:text-red-800 font-medium border-red-200 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Quit Test
            </Button>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <TestIcon className="w-5 h-5 text-indigo-600" />
              <p className="text-sm font-semibold text-gray-700">{getTestTitle(currentTest)}</p>
            </div>
            <p className="text-xs text-gray-500">Question {getCurrentQuestionNumber()} of {getTotalQuestions()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-3 bg-white/80 backdrop-blur-md shadow-sm">
          <Progress value={getCurrentProgress()} className="h-2 bg-gray-200" />
          <p className="text-center text-sm text-gray-600 mt-2 font-medium">{Math.round(getCurrentProgress())}% Complete</p>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <Card className="h-full border-0 shadow-none bg-transparent">
            <CardContent className="p-0 h-full">
              <ScrollArea ref={scrollAreaRef} className="h-full">
                <div className="space-y-4 p-4 pb-24 max-w-4xl mx-auto">
                  {chatMessages.map((message, index) => (
                    <div key={index} className="animate-fade-in">
                      {message.type === 'macroFeedback' ? (
                        <div className="w-full">
                          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-3xl p-6 shadow-2xl border-2 border-purple-200 animate-bounce-in relative overflow-hidden">
                            {/* Animated background elements */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                              <Sparkles className="absolute top-4 right-6 w-6 h-6 text-purple-400 animate-pulse" />
                              <Star className="absolute bottom-4 left-6 w-5 h-5 text-pink-400 animate-bounce" />
                              <Trophy className="absolute top-6 left-1/2 w-4 h-4 text-yellow-400 animate-float" />
                              <Zap className="absolute bottom-6 right-1/4 w-4 h-4 text-orange-400 animate-pulse" />
                            </div>
                            <div className="relative z-10 text-center">
                              <div className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text leading-relaxed whitespace-pre-line animate-slide-in-up">
                                {message.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : message.type === 'testActions' ? (
                        <div className="w-full" ref={index === chatMessages.length - 1 ? questionRef : undefined}>
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 shadow-lg border border-blue-100">
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              {message.completedPart && (
                                <>
                                  <Button
                                    onClick={() => continueToNextPart(message.completedPart!)}
                                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl"
                                  >
                                    Continue to Next Part
                                  </Button>
                                  <Button
                                    onClick={handleQuit}
                                    variant="outline"
                                    className="flex items-center justify-center border-red-300 text-red-600 hover:bg-red-50 font-medium px-6 py-3 rounded-xl"
                                  >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Quit & See Results
                                  </Button>
                                </>
                              )}
                              {message.completedTest && (
                                <>
                                  <Button
                                    onClick={() => setPhase(`${message.completedTest}Report` as TestPhase)}
                                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl"
                                  >
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    View Report
                                  </Button>
                                  {message.completedTest !== 'learning' && (
                                    <Button
                                      onClick={() => {
                                        const nextTest = message.completedTest === 'dominant' ? 'personality' : 'learning';
                                        continueFromReport(nextTest);
                                      }}
                                      className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl"
                                    >
                                      Continue to Next Test
                                    </Button>
                                  )}
                                  <Button
                                    onClick={handleQuit}
                                    variant="outline"
                                    className="flex items-center justify-center border-red-300 text-red-600 hover:bg-red-50 font-medium px-6 py-3 rounded-xl"
                                  >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Quit & See Final Results
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : message.type === 'options' ? (
                        <div className="w-full" ref={index === chatMessages.length - 1 ? questionRef : undefined}>
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 shadow-lg border border-indigo-100">
                            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Choose your response:</p>
                            <div className="grid grid-cols-1 gap-2">
                              {responseOptions.map((option) => (
                                <div key={option.value} className="flex items-center space-x-3 p-3 bg-white rounded-xl hover:bg-indigo-50 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-indigo-300 hover:shadow-md">
                                  <Checkbox
                                    checked={selectedResponse === option.value}
                                    onCheckedChange={() => handleResponse(option.value)}
                                    className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 flex-shrink-0"
                                  />
                                  <label 
                                    className="flex-1 cursor-pointer text-sm font-medium text-gray-700 hover:text-indigo-700"
                                    onClick={() => handleResponse(option.value)}
                                  >
                                    <span className="font-bold text-indigo-600 mr-2">({option.value})</span>
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : message.type === 'dynamicOptions' ? (
                        <div className="w-full" ref={index === chatMessages.length - 1 ? questionRef : undefined}>
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 shadow-lg border border-green-100">
                            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Choose the option that best describes you:</p>
                            <div className="grid grid-cols-1 gap-2">
                              {message.dynamicOptions?.map((option, idx) => (
                                <div key={idx} className="flex items-center space-x-3 p-3 bg-white rounded-xl hover:bg-green-50 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-green-300 hover:shadow-md">
                                  <Checkbox
                                    checked={selectedResponse === option}
                                    onCheckedChange={() => handleResponse(option)}
                                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 flex-shrink-0"
                                  />
                                  <label 
                                    className="flex-1 cursor-pointer text-sm font-medium text-gray-700 hover:text-green-700"
                                    onClick={() => handleResponse(option)}
                                  >
                                    {option}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                          <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${
                              message.type === 'bot' 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse' 
                                : 'bg-gradient-to-r from-green-400 to-blue-500'
                            }`}>
                              {message.type === 'bot' ? (
                                <Bot className="w-5 h-5 text-white" />
                              ) : (
                                <User className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className={`rounded-2xl p-4 shadow-lg ${
                              message.type === 'bot' 
                                ? 'bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-200' 
                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                            }`}>
                              <p className={`text-sm leading-relaxed whitespace-pre-line ${
                                message.type === 'bot' ? 'font-medium' : 'font-semibold'
                              }`}>
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quit Confirmation Modal */}
      {showQuitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Quit Test?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to quit? {responses.length > 0 && "You'll receive results for completed sections."}
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1"
              >
                Continue Test
              </Button>
              <Button 
                onClick={handleQuit}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Yes, Quit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalityTest;
