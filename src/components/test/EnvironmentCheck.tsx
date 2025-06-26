import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function EnvironmentCheck() {
  const apiUrl = process.env.NEXT_PUBLIC_LANGFLOW_API_URL;
  const isConfigured = !!apiUrl;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Environment Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">API URL Configured:</span>
            <span className={`px-2 py-1 rounded text-sm ${isConfigured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConfigured ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          
          {isConfigured && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">API URL:</div>
              <div className="text-sm text-gray-600 break-all">{apiUrl}</div>
            </div>
          )}
          
          {!isConfigured && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm text-yellow-800">
                <strong>Configuration Required:</strong> Please add NEXT_PUBLIC_LANGFLOW_API_URL to your .env.local file
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 