import { supabase } from "@/integrations/supabase/client"
import { User, Session } from "@supabase/supabase-js"
import { toast } from "@/components/ui/use-toast"

export const handleSignUp = async (email: string, password: string, metadata: any = {}) => {
  try {
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
    toast({
      title: "خطأ",
      description: err.message,
      variant: "destructive",
    })
    return { data: null, error: err }
  }
}

export const handleSignIn = async (email: string, password: string) => {
  try {
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
    return { data: null, error: err }
  }
}

export const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      if (error.message.includes('session_not_found')) {
        return { error: null }
      }
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