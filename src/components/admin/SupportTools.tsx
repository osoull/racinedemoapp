import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type SupportTicket = Tables<"support_tickets"> & {
  user?: Tables<"profiles">;
};

const SupportTools = () => {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          user:profiles(full_name)
        `);

      if (error) throw error;
      return data as SupportTicket[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>أدوات الدعم</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="space-y-4">
            {tickets?.map((ticket) => (
              <TicketCard key={ticket.ticket_id} ticket={ticket} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TicketCard = ({ ticket }: { ticket: SupportTicket }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">
              {ticket.category}
            </h3>
            <p className="text-sm text-gray-500">
              المستخدم: {ticket.user?.full_name}
            </p>
            <p className="text-sm text-gray-500">
              الحالة: {ticket.status}
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

export default SupportTools;