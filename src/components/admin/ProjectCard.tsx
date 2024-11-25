import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { RiskRatingBadge } from "./project/RiskRatingBadge";
import { RiskRatingManager } from "./project/RiskRatingManager";
import { ProjectActions } from "./project/ProjectActions";
import { ProjectStatus } from "./project/ProjectStatus";
import { useState } from "react";

type Project = Tables<"projects"> & {
  owner?: {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
  };
  risk_rating?: string | null;
  risk_description?: string | null;
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

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          <div className="mt-2">
            <ProjectStatus status={project.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {project.risk_rating && (
            <RiskRatingBadge rating={project.risk_rating} description={project.risk_description} />
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
        <ProjectActions 
          projectId={project.id}
          status={project.status}
          canEdit={canEdit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <div className="text-sm text-muted-foreground">
          {project.owner?.first_name} {project.owner?.last_name}
        </div>
      </div>
    </Card>
  );
};
