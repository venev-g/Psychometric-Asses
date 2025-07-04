// src/app/dashboard/page.tsx
import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ModernDashboard } from '@/components/dashboard/ModernDashboard'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return <ModernDashboard user={user} />
}