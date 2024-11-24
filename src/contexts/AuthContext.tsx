import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

interface AuthContextType {
  session: Session | null
  user: User | null
  signIn: (email: string, password: string) => Promise<{ error?: Error }>
  signUp: (email: string, password: string, userType: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const INACTIVITY_TIMEOUT = 5 * 60 * 1000 // 5 minutes in milliseconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  let inactivityTimer: NodeJS.Timeout

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }
    if (session) {
      inactivityTimer = setTimeout(async () => {
        await signOut()
        toast({
          title: "تم تسجيل الخروج",
          description: "تم تسجيل خروجك تلقائياً بسبب عدم النشاط",
        })
      }, INACTIVITY_TIMEOUT)
    }
  }

  useEffect(() => {
    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'mousemove']
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer)
    })

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      if (session) {
        resetInactivityTimer()
      }
    })

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      if (session) {
        resetInactivityTimer()
      }
    })

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer)
      })
      if (inactivityTimer) {
        clearTimeout(inactivityTimer)
      }
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) return { error }
      
      toast({
        title: "نجاح",
        description: "تم تسجيل الدخول بنجاح",
      })
      return {}
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ",
        variant: "destructive",
      })
      return { error: error instanceof Error ? error : new Error("Unknown error") }
    }
  }

  const signUp = async (email: string, password: string, userType: string) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (signUpError) throw signUpError

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('id', (await supabase.auth.getUser()).data.user?.id)

      if (updateError) throw updateError

      toast({
        title: "نجاح",
        description: "يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ",
        variant: "destructive",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      if (inactivityTimer) {
        clearTimeout(inactivityTimer)
      }
      toast({
        title: "نجاح",
        description: "تم تسجيل الخروج بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}