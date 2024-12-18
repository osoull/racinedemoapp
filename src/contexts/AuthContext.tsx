import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { Session, User } from "@supabase/supabase-js"
import { useToast } from "@/components/ui/use-toast"

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
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) throw error

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول باستخدام بريدك الإلكتروني وكلمة المرور",
      })

      return { data, error: null }
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "خطأ",
        description: err.message,
        variant: "destructive",
      })
      return { data: null, error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      })

      return { data, error: null }
    } catch (err: any) {
      setError(err.message)
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      // First clear local session state
      setSession(null)
      setUser(null)
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        // If there's an error, but it's just about session not found, we can ignore it
        if (error.message.includes('session_not_found')) {
          return { error: null }
        }
        // For other errors, show the toast
        toast({
          title: "خطأ",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نراك قريباً",
      })
      
      return { error: null }
    } catch (err: any) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      })
      return { error: err }
    }
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