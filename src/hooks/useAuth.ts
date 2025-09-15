'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: any | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null })

  const getSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      setState(s => ({ ...s, error: error.message, loading: false }))
      return
    }
    setState(s => ({ ...s, user: data.session?.user ?? null, loading: false, error: null }))
  }, [])

  useEffect(() => {
    getSession()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(s => ({ ...s, user: session?.user ?? null, loading: false }))
    })
    return () => { listener.subscription.unsubscribe() }
  }, [getSession])

  const signUp = async (email: string, password: string) => {
    setState(s => ({ ...s, error: null, loading: true }))
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setState(s => ({ ...s, error: error.message, loading: false }))
    else setState(s => ({ ...s, loading: false }))
  }

  const signIn = async (email: string, password: string) => {
    setState(s => ({ ...s, error: null, loading: true }))
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setState(s => ({ ...s, error: error.message, loading: false }))
    else setState(s => ({ ...s, loading: false }))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setState(s => ({ ...s, user: null }))
  }

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signUp,
    signIn,
    signOut
  }
}
