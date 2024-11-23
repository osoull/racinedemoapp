import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects"> & {
  owner?: Tables<"profiles">;
};

const ProjectManagement = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          owner:profiles(full_name)
        `);

      if (error) throw error;
      return data as Project[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المشاريع</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="space-y-4">
            {projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{project.title}</h3>
            <p className="text-sm text-gray-500">
              صاحب المشروع: {project.owner?.full_name}
            </p>
            <p className="text-sm text-gray-500">
              الحالة: {project.status}
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

export default ProjectManagement;