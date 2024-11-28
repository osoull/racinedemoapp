import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface SignInFormProps {
  onSignIn: (email: string, password: string) => Promise<void>
  onRegisterClick: () => void
  isLoading: boolean
}

export function SignInForm({ onSignIn, onRegisterClick, isLoading }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSignIn(email, password)
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>مرحباً بك</CardTitle>
        <CardDescription>
          قم بتسجيل الدخول للمتابعة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              dir="rtl"
              autoComplete="email"
            />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              dir="rtl"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
          <div className="text-sm text-muted-foreground text-center">
            <button 
              onClick={onRegisterClick}
              className="text-primary hover:underline"
              type="button"
              disabled={isLoading}
            >
              ليس لديك حساب؟ قم بإنشاء حساب جديد
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}