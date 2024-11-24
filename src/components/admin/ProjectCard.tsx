import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProjectForm } from "./ProjectForm";
import { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects"> & {
  owner?: {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
  };
};

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
}

const formatOwnerName = (owner: Project['owner']) => {
  if (!owner) return 'غير معروف';
  return [owner.first_name, owner.middle_name, owner.last_name]
    .filter(Boolean)
    .join(' ') || 'غير معروف';
};

export const ProjectCard = ({ project, onEdit, onDelete, canEdit }: ProjectCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <p className="text-sm text-gray-500">
              صاحب المشروع: {formatOwnerName(project.owner)}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant={
                project.status === 'approved' ? 'secondary' :
                project.status === 'rejected' ? 'destructive' :
                'default'
              }>
                {project.status}
              </Badge>
              <p className="text-sm text-gray-500">
                الهدف: {project.funding_goal} ريال
              </p>
              {project.current_funding && (
                <p className="text-sm text-gray-500">
                  التمويل الحالي: {project.current_funding} ريال
                </p>
              )}
            </div>
            {project.description && (
              <p className="text-sm text-gray-600">{project.description}</p>
            )}
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onEdit}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <ProjectForm project={project} onSuccess={onEdit} />
                </DialogContent>
              </Dialog>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};