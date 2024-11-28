import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Wallet, Shield, Phone, Mail, Calendar } from "lucide-react"
import { format } from "date-fns"

type InvestorCardProps = {
  investor: any
}

export function InvestorCard({ investor }: InvestorCardProps) {
  const fullName = [
    investor.first_name,
    investor.middle_name,
    investor.last_name
  ].filter(Boolean).join(" ")

  return (
    <Card className="p-6 hover:shadow-md transition-all">
      <div className="flex items-start gap-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{fullName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {investor.email}
            </div>
            {investor.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {investor.phone}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant={investor.user_type === "qualified_investor" ? "default" : "secondary"}>
              {investor.user_type === "qualified_investor" ? "مستثمر مؤهل" : "مستثمر أساسي"}
            </Badge>
            <Badge variant={investor.kyc_status === "verified" ? "success" : "warning"}>
              {investor.kyc_status === "verified" ? "KYC مكتمل" : "KYC معلق"}
            </Badge>
            <Badge variant="outline">
              <Calendar className="h-3 w-3 ml-1" />
              {format(new Date(investor.created_at), "yyyy/MM/dd")}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                الدخل السنوي
              </div>
              <div className="font-medium">
                {investor.investor_kyc?.annual_income?.toLocaleString() || "غير محدد"} ريال
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                مستوى المخاطرة
              </div>
              <div className="font-medium">
                {investor.investor_kyc?.risk_tolerance || "غير محدد"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}