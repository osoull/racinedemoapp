import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  session: Session | null
  user: User | null
  signIn: (email: string, password: string) => Promise<{ error?: Error }>
  signUp: (email: string, password: string, userType: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (!session) {
        navigate('/')
        return
      }

      // Récupérer le type d'utilisateur et rediriger en conséquence
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          switch (profile.user_type) {
            case "borrower":
              navigate("/borrower")
              break
            case "basic_investor":
            case "qualified_investor":
              navigate("/investor")
              break
            case "admin":
              navigate("/admin")
              break
            case "investment_manager":
              navigate("/investment-manager")
              break
            default:
              navigate("/")
          }
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

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
      navigate('/')
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