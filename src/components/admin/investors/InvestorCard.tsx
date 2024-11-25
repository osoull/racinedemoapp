import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Wallet, Shield } from "lucide-react"

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
    <Card className="p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{fullName}</h3>
          <p className="text-sm text-muted-foreground">{investor.email}</p>
          
          <div className="flex gap-2 mt-4">
            <Badge variant={investor.user_type === "qualified_investor" ? "default" : "secondary"}>
              {investor.user_type === "qualified_investor" ? "مستثمر مؤهل" : "مستثمر أساسي"}
            </Badge>
            <Badge variant={investor.kyc_status === "verified" ? "success" : "warning"}>
              {investor.kyc_status === "verified" ? "KYC مكتمل" : "KYC معلق"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span>
                {investor.investor_kyc?.annual_income?.toLocaleString() || "غير محدد"} ريال
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>
                {investor.investor_kyc?.risk_tolerance || "غير محدد"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}