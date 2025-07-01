'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signIn(formData: FormData) {
  console.log('signIn called')
  // Create a Supabase client instance
  const supabase = await createClient()
  console.log('Supabase client created')
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  console.log('Data prepared for sign-in:', data)
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Data prepared for sign-up:', data)
  const { error } = await supabase.auth.signUp(data)

  console.log('Sign-up attempt:', data)
  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
