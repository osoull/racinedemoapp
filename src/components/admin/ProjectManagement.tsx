import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useState } from "react";
import { ProjectForm } from "./ProjectForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Project = Tables<"projects"> & {
  owner?: {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
  };
};

const ProjectManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          owner:profiles(first_name, middle_name, last_name)
        `);

      if (error) throw error;
      return data as Project[];
    },
  });

  // Real-time subscription
  useRealtimeSubscription("projects", {
    onUpdate: () => queryClient.invalidateQueries({ queryKey: ["admin-projects"] }),
    onInsert: () => queryClient.invalidateQueries({ queryKey: ["admin-projects"] }),
    onDelete: () => queryClient.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم حذف المشروع بنجاح",
        description: "تم حذف المشروع وجميع البيانات المرتبطة به",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف المشروع",
        description: "حدث خطأ أثناء محاولة حذف المشروع",
        variant: "destructive",
      });
      console.error("Error deleting project:", error);
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة المشاريع</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProject(null)}>
              إضافة مشروع جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <ProjectForm
              project={editingProject}
              onSuccess={() => {
                setEditingProject(null);
                queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="space-y-4">
            {projects?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => setEditingProject(project)}
                onDelete={() => deleteProjectMutation.mutate(project.id)}
                canEdit={user?.id === project.owner_id}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const formatOwnerName = (owner: Project['owner']) => {
  if (!owner) return 'غير معروف';
  return [owner.first_name, owner.middle_name, owner.last_name]
    .filter(Boolean)
    .join(' ') || 'غير معروف';
};

const ProjectCard = ({ 
  project, 
  onEdit, 
  onDelete,
  canEdit 
}: { 
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
}) => {
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

export default ProjectManagement;