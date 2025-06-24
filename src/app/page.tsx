// src/app/page.tsx
import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Check if user is already authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Psychometric Assessment Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Discover Your
            <span className="text-blue-600"> Potential</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Take scientifically-backed psychometric assessments to understand your intelligence patterns, 
            personality traits, and learning preferences.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">Start Your Assessment</Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Multiple Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Discover your unique intelligence profile across 8 different types of intelligence.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personality Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Understand your DISC personality type and working style preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Styles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Identify your VARK learning preferences and optimize your study methods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose Our Platform?
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">🧠</span>
                </div>
                <h3 className="text-lg font-medium">Science-Based</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Built on proven psychological theories and research
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-medium">Detailed Reports</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Get comprehensive insights and actionable recommendations
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-medium">Privacy First</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Your data is secure and completely confidential
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-medium">Fast & Easy</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Complete assessments in minutes, not hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 Psychometric Assessment Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}