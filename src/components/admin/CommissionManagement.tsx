import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Commission = Tables<"commissions">;

const CommissionManagement = () => {
  const { data: commissions, isLoading } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select("*");

      if (error) throw error;
      return data as Commission[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة العمولات</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="space-y-4">
            {commissions?.map((commission) => (
              <CommissionCard 
                key={commission.commission_id} 
                commission={commission} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CommissionCard = ({ commission }: { commission: Commission }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">
              {commission.commission_type}
            </h3>
            <p className="text-sm text-gray-500">
              النسبة: {commission.rate}%
            </p>
          </div>
          <div className="space-x-2">
            {/* Add action buttons here */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionManagement;