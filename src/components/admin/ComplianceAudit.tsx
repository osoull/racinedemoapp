import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCheck2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ComplianceAuditProps {
  tab?: string;
}

interface PlatformLicense {
  id: string;
  license_type: string;
  license_number: string;
  issue_date: string;
  expiry_date: string;
  status: string;
}

export default function ComplianceAudit({ tab = "cma" }: ComplianceAuditProps) {
  const { data: licenses, isLoading } = useQuery({
    queryKey: ['platform-licenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_licenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PlatformLicense[];
    }
  });

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ar });
  };

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
              {isLoading ? (
                <div className="text-center p-4">جاري التحميل...</div>
              ) : licenses?.map((license) => (
                <div key={license.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{license.license_type}</p>
                    <p className="text-sm text-muted-foreground">
                      رقم الترخيص: {license.license_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      صالح حتى: {formatDate(license.expiry_date)}
                    </p>
                  </div>
                  {license.status === 'active' ? (
                    <FileCheck2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              ))}
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
}