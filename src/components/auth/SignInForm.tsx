import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface SignInFormProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export function SignInForm({ onForgotPassword, onSignUp }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)
      if (error) throw error

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      })
    } catch (error) {
      console.error("Auth error:", error)
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "تأكد من صحة البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <img 
        src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
        alt="Raseen Logo" 
        className="w-64 md:w-72 lg:w-80 mb-8 object-contain dark:hidden" 
      />
      <img 
        src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg" 
        alt="Raseen Logo" 
        className="w-64 md:w-72 lg:w-80 mb-8 object-contain hidden dark:block" 
      />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>مرحباً بك</CardTitle>
          <CardDescription>
            قم بتسجيل الدخول للمتابعة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
            <div className="text-sm text-muted-foreground text-center space-y-2">
              <button 
                type="button"
                onClick={onForgotPassword}
                className="text-primary hover:underline block w-full"
                disabled={isLoading}
              >
                نسيت كلمة المرور؟
              </button>
              <button 
                type="button"
                onClick={onSignUp}
                className="text-primary hover:underline block w-full"
                disabled={isLoading}
              >
                ليس لديك حساب؟ قم بإنشاء حساب جديد
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}