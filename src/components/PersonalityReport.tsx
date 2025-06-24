
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestResponse, personalityTypes } from '@/data/testQuestions';
import { ArrowRight, Sparkles, Heart, Star } from 'lucide-react';

interface PersonalityReportProps {
  responses: TestResponse[];
  onContinue: () => void;
}

const PersonalityReport = ({ responses, onContinue }: PersonalityReportProps) => {
  const calculatePersonalityType = () => {
    const personalityResponses = responses.filter(r => r.testType === 'personality');
    
    // Calculate scores for each dimension
    const scores = {
      E: 0, I: 0, // Extraversion vs Introversion
      S: 0, N: 0, // Sensing vs Intuition  
      T: 0, F: 0, // Thinking vs Feeling
      J: 0, P: 0  // Judging vs Perceiving
    };

    personalityResponses.forEach(response => {
      const score = response.response as number;
      const category = response.category;
      
      if (category === "Extraversion vs Introversion") {
        if (response.question.includes("energized by being around") || 
            response.question.includes("center of attention")) {
          scores.E += score;
          scores.I += (6 - score);
        } else {
          scores.I += score;
          scores.E += (6 - score);
        }
      } else if (category === "Sensing vs Intuition") {
        if (response.question.includes("concrete facts") || 
            response.question.includes("direct experience")) {
          scores.S += score;
          scores.N += (6 - score);
        } else {
          scores.N += score;
          scores.S += (6 - score);
        }
      } else if (category === "Thinking vs Feeling") {
        if (response.question.includes("logical analysis") || 
            response.question.includes("set aside personal feelings")) {
          scores.T += score;
          scores.F += (6 - score);
        } else {
          scores.F += score;
          scores.T += (6 - score);
        }
      } else if (category === "Judging vs Perceiving") {
        if (response.question.includes("decided and settled") || 
            response.question.includes("organized and structured")) {
          scores.J += score;
          scores.P += (6 - score);
        } else {
          scores.P += score;
          scores.J += (6 - score);
        }
      }
    });

    // Determine personality type
    const type = 
      (scores.E > scores.I ? 'E' : 'I') +
      (scores.S > scores.N ? 'S' : 'N') +
      (scores.T > scores.F ? 'T' : 'F') +
      (scores.J > scores.P ? 'J' : 'P');

    return personalityTypes.find(p => p.code === type) || personalityTypes[0];
  };

  const personalityType = calculatePersonalityType();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 font-roboto p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Star className="absolute top-20 left-10 w-6 h-6 text-purple-200 opacity-30 animate-pulse" />
        <Heart className="absolute top-32 right-20 w-8 h-8 text-pink-200 opacity-30 animate-float" />
        <Sparkles className="absolute bottom-40 left-20 w-7 h-7 text-indigo-200 opacity-30 animate-bounce" />
        <Star className="absolute bottom-20 right-10 w-5 h-5 text-purple-200 opacity-30 animate-pulse" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm mb-8 animate-slide-in-up">
          <CardHeader className="text-center pb-6">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-6xl animate-bounce-in shadow-2xl">
              {personalityType.character}
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
              {personalityType.title}
            </CardTitle>
            <div className="text-2xl font-semibold text-gray-700 mt-2 animate-fade-in">
              {personalityType.code}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Personality Description */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 text-center animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-purple-600 mr-2 animate-spin-slow" />
                <h3 className="text-2xl font-bold text-purple-800">Your Personality Profile</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {personalityType.summary}
              </p>
            </div>

            {/* Animated Character Display */}
            <div className="text-center py-8 animate-fade-in">
              <div className="inline-block transform hover:scale-110 transition-transform duration-300">
                <div className="w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-8xl shadow-2xl animate-pulse">
                  {personalityType.character}
                </div>
              </div>
              <p className="text-lg text-gray-600 mt-4 font-medium">
                This character represents your unique personality type! 🎭
              </p>
            </div>

            {/* Continue Button */}
            <div className="text-center pt-6 animate-fade-in">
              <Button 
                onClick={onContinue}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                size="lg"
              >
                Continue to Learning Style Test ✨
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalityReport;
