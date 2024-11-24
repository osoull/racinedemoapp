import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";

type KycComplianceProps = {
  users: any[];
  formatUserName: (user: any) => string;
};

export const KycCompliance = ({ users, formatUserName }: KycComplianceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>التحقق من هوية العملاء</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <section className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">طلبات التحقق الجديدة</h3>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {users?.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{formatUserName(user)}</p>
                    <p className="text-sm text-muted-foreground">
                      حالة التحقق: {user.kyc_status === 'approved' ? 'مكتمل' : 'قيد المراجعة'}
                    </p>
                  </div>
                  {user.kyc_status === 'pending' && (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              ))}
            </ScrollArea>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};