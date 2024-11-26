import { Tables } from "@/integrations/supabase/types";
import { ProjectForm } from "./sections/ProjectForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface ProjectDetailsProps {
  project?: Tables<"projects"> | null;
  onSubmit: (data: any) => void;
}

export const ProjectDetails = ({ project, onSubmit }: ProjectDetailsProps) => {
  return (
    <Card className="h-[calc(100vh-6rem)]">
      <ScrollArea className="h-full p-6">
        <ProjectForm project={project} onSubmit={onSubmit} />
      </ScrollArea>
    </Card>
  );
};