import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
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
  filter?: 'pending' | 'active' | 'completed' | 'rejected';
}

const getStatusInArabic = (status: string | undefined) => {
  switch (status) {
    case 'pending':
      return 'قيد المراجعة';
    case 'active':
      return 'نشط';
    case 'completed':
      return 'مكتمل';
    case 'rejected':
      return 'مرفوض';
    default:
      return '';
  }
};

const ProjectManagement = ({ filter }: ProjectManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const isAdmin = user?.user_metadata?.user_type === 'admin' || user?.user_metadata?.user_type === 'investment_manager';

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects", filter],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select(`
          *,
          owner:profiles(first_name, middle_name, last_name),
          risk_rating:risk_ratings(rating)
        `);

      // Appliquer le filtre de statut si spécifié
      if (filter) {
        if (filter === 'active') {
          query = query.eq('status', 'approved');
        } else {
          query = query.eq('status', filter);
        }
      }

      // Ordonner par date de création, plus récent en premier
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(project => ({
        ...project,
        risk_rating: project.risk_rating?.[0] || null
      })) as Project[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('public:projects')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects' 
        }, 
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "مشروع جديد",
              description: `تم إنشاء مشروع جديد: ${payload.new.title}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

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
          <div className="flex items-center justify-center h-32">جاري التحميل...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد مشاريع {filter ? `بحالة ${getStatusInArabic(filter)}` : ''}
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => setEditingProject(project)}
                onDelete={() => deleteProjectMutation.mutate(project.id)}
                canEdit={user?.id === project.owner_id}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectManagement;