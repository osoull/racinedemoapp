import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle2, Building2, LogIn } from "lucide-react"

type UserType = "investor" | "borrower";
type SelectionType = UserType | "login";

interface UserTypeSelectionProps {
  onSelect: (type: SelectionType) => void;
}

export function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="space-y-8 w-full max-w-3xl px-4">
      <img 
        src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F8fefc08ff6352b1f82851d81737a6460.cdn.bubble.io%2Ff1729676645537x190880546208797250%2Flogo-horizontal-full.png" 
        alt="Raseen Logo" 
        className="w-64 md:w-72 lg:w-80 mx-auto object-contain" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
  );
}
