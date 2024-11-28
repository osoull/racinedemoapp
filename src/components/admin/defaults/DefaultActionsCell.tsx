import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentDefault } from "@/types/payment-defaults";
import { MoreHorizontal, Send, FileText, Archive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CreateResolutionPlanDialog } from "./CreateResolutionPlanDialog";

interface DefaultActionsCellProps {
  default: PaymentDefault;
}

export function DefaultActionsCell({ default: defaultCase }: DefaultActionsCellProps) {
  const { toast } = useToast();
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);

  const handleSendReminder = async () => {
    try {
      // Enregistrer l'action
      await supabase.from("default_action_history").insert({
        default_id: defaultCase.id,
        action_type: "send_reminder",
        performed_by: (await supabase.auth.getUser()).data.user?.id,
        details: {
          type: "email",
          timestamp: new Date().toISOString(),
        },
      });

      // Créer une notification
      await supabase.from("notifications").insert({
        user_id: defaultCase.borrower_id,
        title: "تذكير بالدفع المتأخر",
        message: `لديك دفعة متأخرة بقيمة ${defaultCase.total_amount_due} ريال للمشروع ${defaultCase.funding_request?.title}`,
      });

      toast({
        title: "تم إرسال التذكير",
        description: "تم إرسال تذكير للمقترض بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال التذكير",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async () => {
    try {
      await supabase
        .from("payment_defaults")
        .update({ status: "archived" })
        .eq("id", defaultCase.id);

      toast({
        title: "تم الأرشفة",
        description: "تم أرشفة حالة التخلف عن السداد بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الأرشفة",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">فتح القائمة</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSendReminder}>
            <Send className="mr-2 h-4 w-4" />
            إرسال تذكير
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsResolutionDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            إنشاء خطة تسوية
          </DropdownMenuItem>
          {defaultCase.status === "resolved" && (
            <DropdownMenuItem onClick={handleArchive}>
              <Archive className="mr-2 h-4 w-4" />
              أرشفة
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateResolutionPlanDialog
        defaultCase={defaultCase}
        open={isResolutionDialogOpen}
        onOpenChange={setIsResolutionDialogOpen}
      />
    </>
  );
}