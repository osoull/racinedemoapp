import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";
import { RiskRatingBadge } from "./project/RiskRatingBadge";
import { RiskRatingManager } from "./project/RiskRatingManager";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type Project = Tables<"projects"> & {
  owner?: {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
  };
  risk_rating?: {
    rating: string;
  } | null;
};

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  isAdmin: boolean;
}

export const ProjectCard = ({ project, onEdit, onDelete, canEdit, isAdmin }: ProjectCardProps) => {
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'approved' })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "تم اعتماد المشروع بنجاح",
      });

      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من اعتماد المشروع",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {project.risk_rating && (
            <RiskRatingBadge rating={project.risk_rating.rating} />
          )}
          {isAdmin && (
            <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  تقييم المخاطر
                </Button>
              </DialogTrigger>
              <DialogContent>
                <RiskRatingManager 
                  projectId={project.id} 
                  onClose={() => setIsRatingOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="space-x-2 rtl:space-x-reverse">
          {(canEdit || isAdmin) && (
            <>
              <Button variant="outline" size="sm" onClick={onEdit}>
                تعديل
              </Button>
              {canEdit && (
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  حذف
                </Button>
              )}
              {isAdmin && project.status === 'pending' && (
                <Button variant="default" size="sm" onClick={handleApprove}>
                  اعتماد المشروع
                </Button>
              )}
            </>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {project.owner?.first_name} {project.owner?.last_name}
        </div>
      </div>
    </Card>
  );
};