import { Tables } from "@/integrations/supabase/types";
import { ProjectFormSteps } from "./project/ProjectFormSteps";

interface ProjectFormProps {
  project?: Tables<"projects"> | null;
  onSuccess?: () => void;
}

export const ProjectForm = ({ project, onSuccess }: ProjectFormProps) => {
  return (
    <ProjectFormSteps project={project} onSuccess={onSuccess} />
  );
};