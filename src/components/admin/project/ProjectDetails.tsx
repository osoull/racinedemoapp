import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

const projectSchema = z.object({
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  description: z.string().min(1, "وصف المشروع مطلوب"),
  funding_goal: z.number().min(1000, "المبلغ المستهدف يجب أن يكون أكبر من 1000 ريال"),
  classification: z.string().min(1, "تصنيف المشروع مطلوب"),
  min_investment: z.number().min(1000, "الحد الأدنى للاستثمار يجب أن يكون أكبر من 1000 ريال"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectDetailsProps {
  project?: Tables<"projects"> | null;
  onSubmit: (data: ProjectFormValues) => void;
}

export const ProjectDetails = ({ project, onSubmit }: ProjectDetailsProps) => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      funding_goal: project?.funding_goal || 0,
      classification: project?.classification || "",
      min_investment: project?.min_investment || 1000,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">عنوان المشروع</label>
          <input
            id="title"
            {...form.register("title")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {form.formState.errors.title && <p className="mt-1 text-red-600">{form.formState.errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">وصف المشروع</label>
          <textarea
            id="description"
            {...form.register("description")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {form.formState.errors.description && <p className="mt-1 text-red-600">{form.formState.errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="funding_goal" className="block text-sm font-medium">المبلغ المستهدف (ريال)</label>
          <input
            id="funding_goal"
            type="number"
            {...form.register("funding_goal")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {form.formState.errors.funding_goal && <p className="mt-1 text-red-600">{form.formState.errors.funding_goal.message}</p>}
        </div>

        <div>
          <label htmlFor="classification" className="block text-sm font-medium">تصنيف المشروع</label>
          <input
            id="classification"
            {...form.register("classification")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {form.formState.errors.classification && <p className="mt-1 text-red-600">{form.formState.errors.classification.message}</p>}
        </div>

        <div>
          <label htmlFor="min_investment" className="block text-sm font-medium">الحد الأدنى للاستثمار (ريال)</label>
          <input
            id="min_investment"
            type="number"
            {...form.register("min_investment")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {form.formState.errors.min_investment && <p className="mt-1 text-red-600">{form.formState.errors.min_investment.message}</p>}
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "جاري الحفظ..." : "متابعة لدفع الرسوم"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
