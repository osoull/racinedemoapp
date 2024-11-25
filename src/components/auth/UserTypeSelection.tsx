import { Card, CardContent } from "@/components/ui/card"
import { Building2, LogIn, UserCircle2 } from "lucide-react"

type SelectionType = "investor" | "borrower" | "login";

interface UserTypeSelectionProps {
  onSelect: (type: SelectionType) => void;
}

export function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="space-y-8 w-full max-w-3xl px-4">
      <img 
        src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
        alt="Raseen Logo" 
        className="w-64 md:w-72 lg:w-80 mx-auto object-contain dark:hidden" 
      />
      <img 
        src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg" 
        alt="Raseen Logo" 
        className="w-64 md:w-72 lg:w-80 mx-auto object-contain hidden dark:block" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelect("investor")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <UserCircle2 className="w-12 h-12 mx-auto text-primary" />
            <div>
              <h3 className="font-semibold text-lg">مستثمر</h3>
              <p className="text-sm text-muted-foreground">استثمر في المشاريع</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelect("borrower")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <Building2 className="w-12 h-12 mx-auto text-primary" />
            <div>
              <h3 className="font-semibold text-lg">طالب تمويل</h3>
              <p className="text-sm text-muted-foreground">احصل على تمويل لمشروعك</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelect("login")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <LogIn className="w-12 h-12 mx-auto text-primary" />
            <div>
              <h3 className="font-semibold text-lg">تسجيل دخول</h3>
              <p className="text-sm text-muted-foreground">لديك حساب؟ سجل دخول</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}