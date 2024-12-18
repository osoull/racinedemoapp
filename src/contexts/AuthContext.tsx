import React, { createContext, useContext } from "react"
import { Session, User } from "@supabase/supabase-js"
import { useAuthState } from "@/hooks/useAuthState"
import { handleSignIn, handleSignOut, handleSignUp } from "@/utils/authUtils"

type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { 
    session, 
    user, 
    loading, 
    error, 
    setError,
    setSession,
    setUser 
  } = useAuthState()

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    setError(null)
    return handleSignUp(email, password, metadata)
  }

  const signIn = async (email: string, password: string) => {
    setError(null)
    return handleSignIn(email, password)
  }

  const signOut = async () => {
    setSession(null)
    setUser(null)
    return handleSignOut()
  }

  const value = {
    session,
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}