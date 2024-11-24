import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";
import { RiskRatingBadge } from "./project/RiskRatingBadge";
import { RiskRatingManager } from "./project/RiskRatingManager";

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
}

export const ProjectCard = ({ project, onEdit, onDelete, canEdit }: ProjectCardProps) => {
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                تقييم المخاطر
              </Button>
            </DialogTrigger>
            <DialogContent>
              <RiskRatingManager projectId={project.id} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
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
        </div>
        <div className="text-sm text-muted-foreground">
          {project.owner?.first_name} {project.owner?.last_name}
        </div>
      </div>
    </Card>
  );
};