'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Sign in with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    redirect('/login?error=Could not authenticate user')
  }

  // 2. Fetch the role from the public.users table
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  // This log will appear in your VS Code terminal to help us troubleshoot
  console.log("LOGIN ATTEMPT - User:", data.user.email, "Detected Role:", profile?.role)

  // 3. THE SWITCHBOARD
  // Since your table shows 'admin', this will trigger the redirect to /me
  if (profile?.role === 'admin') {
    redirect('/me') 
  } else if (profile?.role === 'dancer') {
    redirect('/dashboard/performer')
  } else if (profile?.role === 'manager') {
    redirect('/dashboard/venue')
  } else if (profile?.role === 'staff') {
    redirect('/staff/check-in')
  } else {
    // Default for 'client' or if the role isn't found
    redirect('/dashboard') 
  }
}