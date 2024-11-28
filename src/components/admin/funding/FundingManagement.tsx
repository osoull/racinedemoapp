import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FundingRequestList } from "./FundingRequestList"

export function FundingManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إدارة التمويل</h2>
        <p className="text-muted-foreground">
          إدارة ومراجعة طلبات التمويل
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>طلبات التمويل</CardTitle>
        </CardHeader>
        <CardContent>
          <FundingRequestList />
        </CardContent>
      </Card>
    </div>
  )
}