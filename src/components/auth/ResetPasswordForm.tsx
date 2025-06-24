'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Alert } from '@/components/ui/Alert'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Database } from '@/types/database.types'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type ResetPasswordData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  useEffect(() => {
    // Check if we have the necessary URL parameters
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')

    if (!accessToken || !refreshToken) {
      setMessage({
        type: 'error',
        text: 'Invalid reset link. Please request a new password reset.'
      })
    }
  }, [searchParams])

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      setLoading(true)
      setMessage(null)

      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({
          type: 'success',
          text: 'Password updated successfully! Redirecting to login...'
        })
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
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
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder="Enter your new password"
          disabled={loading}
        />
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          placeholder="Confirm your new password"
          disabled={loading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  )
}