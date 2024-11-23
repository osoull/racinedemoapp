import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type SupportTicket = Tables<"support_tickets"> & {
  user?: {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
  };
};

const SupportTools = () => {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          user:profiles(first_name, middle_name, last_name)
        `);

      if (error) throw error;
      return data as SupportTicket[];
    },
  });

  const formatUserName = (user: SupportTicket['user']) => {
    if (!user) return 'غير معروف';
    return [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(' ') || 'غير معروف';
  };

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
  const formatUserName = (user: SupportTicket['user']) => {
    if (!user) return 'غير معروف';
    return [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(' ') || 'غير معروف';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">
              {ticket.category}
            </h3>
            <p className="text-sm text-gray-500">
              المستخدم: {formatUserName(ticket.user)}
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