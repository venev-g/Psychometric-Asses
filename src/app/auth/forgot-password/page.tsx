import React from 'react'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
            
            <div className="mt-6 text-center">
              <Link 
                href="/auth/login" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Remember your password? Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}