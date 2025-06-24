// src/app/admin/page.tsx
import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ConfigurationManager } from '@/components/admin/ConfigurationManager'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return <ConfigurationManager />
}