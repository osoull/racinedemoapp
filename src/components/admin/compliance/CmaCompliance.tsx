import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCheck2 } from "lucide-react";

export const CmaCompliance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>متطلبات هيئة السوق المالية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <section className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">تراخيص منصة التمويل الجماعي</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">ترخيص نشاط التمويل الجماعي</p>
                  <p className="text-sm text-muted-foreground">صالح حتى: 30/12/1445</p>
                </div>
                <FileCheck2 className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </section>

          <section className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">التقارير الرقابية</h3>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">تقرير الربع الأول 1445</p>
                  <p className="text-sm text-muted-foreground">تم الرفع بتاريخ: 01/04/1445</p>
                </div>
              </div>
            </ScrollArea>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};