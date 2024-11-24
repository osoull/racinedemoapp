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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

const projectSchema = z.object({
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  description: z.string().min(1, "وصف المشروع مطلوب"),
  funding_goal: z.number().min(1, "المبلغ المستهدف يجب أن يكون أكبر من 0"),
  min_investment: z.number().min(1, "الحد الأدنى للاستثمار يجب أن يكون أكبر من 0"),
  classification: z.enum([
    'تمويل مشاريع طرف ثاني',
    'تمويل الفواتير',
    'تمويل رأس المال العامل',
    'تمويل التوسع',
    'تمويل المشاريع العقارية'
  ], {
    required_error: "يرجى اختيار تصنيف المشروع"
  }),
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
      funding_goal: project?.funding_goal || 0,
      min_investment: 10000, // Default minimum investment
      classification: project?.classification as any || "تمويل مشاريع طرف ثاني",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const projectData = {
        title: values.title,
        description: values.description,
        funding_goal: values.funding_goal,
        min_investment: values.min_investment,
        classification: values.classification,
        owner_id: user?.id,
      };
      
      const { error } = await supabase.from("projects").insert(projectData);
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
      const projectData = {
        title: values.title,
        description: values.description,
        funding_goal: values.funding_goal,
        min_investment: values.min_investment,
        classification: values.classification,
      };
      
      const { error } = await supabase
        .from("projects")
        .update(projectData)
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-documents')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "خطأ في رفع الملف",
        description: "حدث خطأ أثناء محاولة رفع الملف",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم رفع الملف بنجاح",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان المشروع *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تصنيف المشروع *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تصنيف المشروع" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="تمويل مشاريع طرف ثاني">تمويل مشاريع طرف ثاني</SelectItem>
                  <SelectItem value="تمويل الفواتير">تمويل الفواتير</SelectItem>
                  <SelectItem value="تمويل رأس المال العامل">تمويل رأس المال العامل</SelectItem>
                  <SelectItem value="تمويل التوسع">تمويل التوسع</SelectItem>
                  <SelectItem value="تمويل المشاريع العقارية">تمويل المشاريع العقارية</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المشروع *</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="funding_goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المبلغ المستهدف *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_investment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحد الأدنى للاستثمار *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">الحد الأدنى المسموح به: 10000 ريال</p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">المستندات المطلوبة *</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">عرض تقديمي للمشروع</p>
              <p className="text-sm text-muted-foreground">يرجى رفع الملف بصيغة PDF</p>
              <label className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-lg cursor-pointer hover:bg-secondary/20 transition-colors">
                <Upload className="h-4 w-4" />
                <span className="text-sm">رفع الملف</span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'presentation')}
                />
              </label>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">دراسة الجدوى</p>
              <p className="text-sm text-muted-foreground">يرجى رفع الملف بصيغة PDF</p>
              <label className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-lg cursor-pointer hover:bg-secondary/20 transition-colors">
                <Upload className="h-4 w-4" />
                <span className="text-sm">رفع الملف</span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'feasibility')}
                />
              </label>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          {project ? "تحديث المشروع" : "إنشاء المشروع"}
        </Button>
      </form>
    </Form>
  );
};