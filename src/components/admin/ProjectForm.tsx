import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

const projectSchema = z.object({
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  description: z.string().optional(),
  funding_goal: z.string().transform(Number),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Tables<"projects"> | null;
  onSuccess?: () => void;
}

export const ProjectForm = ({ project, onSuccess }: ProjectFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      funding_goal: project?.funding_goal?.toString() || "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const { error } = await supabase.from("projects").insert([
        {
          ...values,
          owner_id: user?.id,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء المشروع بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "خطأ في إنشاء المشروع",
        description: "حدث خطأ أثناء محاولة إنشاء المشروع",
        variant: "destructive",
      });
      console.error("Error creating project:", error);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const { error } = await supabase
        .from("projects")
        .update(values)
        .eq("id", project?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث المشروع بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث المشروع",
        description: "حدث خطأ أثناء محاولة تحديث المشروع",
        variant: "destructive",
      });
      console.error("Error updating project:", error);
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    if (project) {
      updateProjectMutation.mutate(values);
    } else {
      createProjectMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان المشروع</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المشروع</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="funding_goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>هدف التمويل (ريال)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {project ? "تحديث المشروع" : "إنشاء المشروع"}
        </Button>
      </form>
    </Form>
  );
};