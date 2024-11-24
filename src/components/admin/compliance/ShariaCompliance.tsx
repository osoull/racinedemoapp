import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, FileCheck2 } from "lucide-react";

type ShariaComplianceProps = {
  projects: any[];
};

export const ShariaCompliance = ({ projects }: ShariaComplianceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الامتثال الشرعي</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <section className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">المراجعة الشرعية للمشاريع</h3>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              {projects?.map((project) => (
                <div key={project.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-muted-foreground">
                      حالة المراجعة: {project.status === 'approved' ? 'معتمد' : 'قيد المراجعة'}
                    </p>
                  </div>
                  {project.status !== 'approved' && (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              ))}
            </ScrollArea>
          </section>

          <section className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">تقارير المراقب الشرعي</h3>
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium">التقرير الشهري - شعبان 1445</p>
                  <p className="text-sm text-muted-foreground">تاريخ الإصدار: 15/08/1445</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};