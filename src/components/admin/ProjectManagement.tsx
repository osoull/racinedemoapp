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
import { useAuth } from "@/contexts/AuthContext";
import { ProjectCard } from "./ProjectCard";

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

export interface ProjectManagementProps {
  filter?: string;
}

const ProjectManagement = ({ filter }: ProjectManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects", filter],
    queryFn: async () => {
      const query = supabase
        .from("projects")
        .select(`
          *,
          owner:profiles(first_name, middle_name, last_name),
          risk_rating:risk_ratings(rating)
        `)
        .limit(1)
        .single()
        .maybeSingle();

      if (filter) {
        query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform the data to match our Project type
      const transformedData = data ? {
        ...data,
        risk_rating: data.risk_rating?.[0] || null
      } : null;

      return transformedData as Project;
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
            {projects && (
              <ProjectCard
                key={projects.id}
                project={projects}
                onEdit={() => setEditingProject(projects)}
                onDelete={() => deleteProjectMutation.mutate(projects.id)}
                canEdit={user?.id === projects.owner_id}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectManagement;