import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

export default function Index() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
        <h1 className="text-4xl font-bold text-center">مرحباً بك في منصة رسين للتمويل الجماعي</h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl">
          منصة تمويل جماعي متوافقة مع الشريعة الإسلامية تربط المشاريع المبتكرة بالمستثمرين الأخلاقيين
        </p>
        {!user ? (
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-lg"
          >
            تسجيل الدخول
          </Button>
        ) : (
          <Button 
            size="lg" 
            onClick={() => {
              if (user.user_type === "admin") navigate("/admin")
              else if (user.user_type === "investor") navigate("/investor")
              else if (user.user_type === "borrower") navigate("/borrower")
            }}
            className="text-lg"
          >
            لوحة التحكم
          </Button>
        )}
      </div>
    </div>
  )
}