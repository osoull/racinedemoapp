import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ProjectActionsProps {
  projectId: string;
  status: string | null;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectActions = ({ projectId, status, canEdit, onEdit, onDelete }: ProjectActionsProps) => {
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "تم اعتماد المشروع بنجاح",
      });

      await queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    } catch (error) {
      console.error("Error approving project:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من اعتماد المشروع",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsApproving(true);
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "تم رفض المشروع",
      });

      await queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    } catch (error) {
      console.error("Error rejecting project:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من رفض المشروع",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="space-x-2 rtl:space-x-reverse">
      {canEdit && (
        <>
          <Button variant="outline" size="sm" onClick={onEdit}>
            تعديل
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            حذف
          </Button>
        </>
      )}
      {status === 'pending' && (
        <>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleApprove}
            disabled={isApproving}
          >
            {isApproving ? "جاري الاعتماد..." : "اعتماد المشروع"}
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleReject}
            disabled={isApproving}
          >
            رفض المشروع
          </Button>
        </>
      )}
    </div>
  );
};