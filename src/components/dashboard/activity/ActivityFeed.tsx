import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export function ActivityFeed() {
  const { data: transactions } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          user:profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  if (!transactions?.length) {
    return <div className="text-center text-muted-foreground">لا يوجد نشاط حديث</div>;
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">
                {transaction.user?.first_name} {transaction.user?.last_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.type === 'deposit' ? 'إيداع' : 'سحب'} مبلغ {transaction.amount.toLocaleString()} ريال
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(transaction.created_at), { 
                addSuffix: true,
                locale: ar 
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}