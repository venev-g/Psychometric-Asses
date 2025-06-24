'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Alert } from '@/components/ui/Alert'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/lib/validations/auth'
import Link from 'next/link'
import type { Database } from '@/types/database.types'

type SignupData = {
  email: string
  password: string
  confirmPassword: string
  fullName: string
}

export function SignupForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async (data: SignupData) => {
    try {
      setLoading(true)
      setMessage(null)

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName
          }
        }
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({
          type: 'success',
          text: 'Account created successfully! Please check your email to verify your account.'
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.text}
        </Alert>
      )}

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          {...register('fullName')}
          placeholder="Enter your full name"
          disabled={loading}
        />
        {errors.fullName && (
          <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="Enter your email"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder="Enter your password"
          disabled={loading}
        />
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          placeholder="Confirm your password"
          disabled={loading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </span>
      </div>
    </form>
  )
}