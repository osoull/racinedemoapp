import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentDefaultsList } from "./PaymentDefaultsList";
import { DefaultsAnalytics } from "./DefaultsAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { PaymentDefault } from "@/types/payment-defaults";
import { Loader2 } from "lucide-react";

export function PaymentDefaultsManagement() {
  const { data: defaults, isLoading } = useQuery({
    queryKey: ["payment-defaults"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_defaults")
        .select(`
          *,
          borrower:profiles(first_name, last_name),
          funding_request:funding_requests(title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PaymentDefault[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const activeDefaults = defaults?.filter((d) => d.status === "active") || [];
  const resolvedDefaults = defaults?.filter((d) => d.status === "resolved") || [];
  const archivedDefaults = defaults?.filter((d) => d.status === "archived") || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إدارة التخلف عن السداد</h2>
        <p className="text-muted-foreground">
          متابعة وإدارة حالات التخلف عن السداد والإجراءات المتخذة
        </p>
      </div>

      <DefaultsAnalytics defaults={defaults || []} />

      <Card>
        <CardHeader>
          <CardTitle>حالات التخلف عن السداد</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">
                نشط ({activeDefaults.length})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                تمت التسوية ({resolvedDefaults.length})
              </TabsTrigger>
              <TabsTrigger value="archived">
                مؤرشف ({archivedDefaults.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <PaymentDefaultsList defaults={activeDefaults} />
            </TabsContent>

            <TabsContent value="resolved">
              <PaymentDefaultsList defaults={resolvedDefaults} />
            </TabsContent>

            <TabsContent value="archived">
              <PaymentDefaultsList defaults={archivedDefaults} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}