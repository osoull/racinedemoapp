import { Card } from "@/components/ui/card"
import { User, Building2 } from "lucide-react"

type UserTypeSelectionProps = {
  onSelect: (type: "investor" | "project_owner") => void;
}

export function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="space-y-4 w-full max-w-md">
      <img 
        src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F8fefc08ff6352b1f82851d81737a6460.cdn.bubble.io%2Ff1729676645537x190880546208797250%2Flogo-horizontal-full.png" 
        alt="Racine Investment" 
        className="w-64 md:w-72 lg:w-80 mx-auto mb-8" 
      />
      
      <h1 className="text-2xl font-bold text-center mb-8">إنشاء حساب جديد</h1>
      
      <div className="grid gap-4">
        <Card 
          className="p-6 cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelect("investor")}
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">مستثمر</h3>
              <p className="text-muted-foreground text-sm">استثمر في فرص تمويلية متنوعة</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelect("project_owner")}
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">طلب تمويل</h3>
              <p className="text-muted-foreground text-sm">احصل على تمويل لمشروعك</p>
            </div>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          لديك حساب بالفعل؟{" "}
          <button onClick={() => onSelect("login")} className="text-primary hover:underline">
            تسجيل الدخول
          </button>
        </p>
      </div>
    </div>
  )
}