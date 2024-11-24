import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KYCVerificationList } from "./KYCVerificationList"
import { KYCStatusHistory } from "./KYCStatusHistory"

export function KYCManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة التحقق من الهوية</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
            <TabsTrigger value="approved">معتمد</TabsTrigger>
            <TabsTrigger value="rejected">مرفوض</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <KYCVerificationList status="pending" />
          </TabsContent>
          
          <TabsContent value="approved">
            <KYCVerificationList status="approved" />
          </TabsContent>
          
          <TabsContent value="rejected">
            <KYCVerificationList status="rejected" />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <KYCStatusHistory />
        </div>
      </CardContent>
    </Card>
  )
}