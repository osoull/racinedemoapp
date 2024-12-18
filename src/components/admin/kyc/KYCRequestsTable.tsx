import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { KYCVerificationList } from "./KYCVerificationList"

interface KYCRequestsTableProps {
  data: any[] | undefined
  isLoading: boolean
}

export function KYCRequestsTable({ data, isLoading }: KYCRequestsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>طلبات التحقق من الهوية</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <KYCVerificationList requests={data || []} />
        )}
      </CardContent>
    </Card>
  )
}