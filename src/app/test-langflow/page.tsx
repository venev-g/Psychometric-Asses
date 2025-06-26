import { LangflowTest } from '@/components/test/LangflowTest';
import { EnvironmentCheck } from '@/components/test/EnvironmentCheck';

export default function TestLangflowPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Langflow API Test</h1>
          <p className="text-gray-600">Test the AI Mentor integration with your Langflow API</p>
        </div>
        
        <EnvironmentCheck />
        <LangflowTest />
      </div>
    </div>
  );
} 