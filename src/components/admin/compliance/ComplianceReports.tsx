import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const ComplianceReports = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>التقارير الدورية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <section className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">تقارير الامتثال</h3>
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">تقرير مكافحة غسل الأموال</p>
                      <p className="text-sm text-muted-foreground">الربع الأول 1445</p>
                    </div>
                    <FileText className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">تقرير المخاطر التشغيلية</p>
                      <p className="text-sm text-muted-foreground">الربع الأول 1445</p>
                    </div>
                    <FileText className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};