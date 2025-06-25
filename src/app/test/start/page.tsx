import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { StartTestPage } from '@/components/test/StartTestPage'
import { redirect } from 'next/navigation'

export default async function StartTestPageServer() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return <StartTestPage user={user} />
} 