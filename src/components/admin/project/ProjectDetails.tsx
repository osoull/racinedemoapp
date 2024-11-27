import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const projectSchema = z.object({
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  description: z.string().min(1, "وصف المشروع مطلوب"),
  funding_goal: z.number().min(1000, "المبلغ المستهدف يجب أن يكون أكبر من 1000 ريال"),
  classification: z.string().min(1, "تصنيف المشروع مطلوب"),
  min_investment: z.number().min(1000, "الحد الأدنى للاستثمار يجب أن يكون أكبر من 1000 ريال"),
});

const PROJECT_CATEGORIES = [
  { value: "real_estate", label: "مشاريع عقارية" },
  { value: "technology", label: "تقنية المعلومات" },
  { value: "healthcare", label: "الرعاية الصحية" },
  { value: "education", label: "التعليم" },
  { value: "retail", label: "التجزئة" },
  { value: "manufacturing", label: "التصنيع" },
  { value: "services", label: "الخدمات" },
  { value: "agriculture", label: "الزراعة" }
];

interface ProjectDetailsProps {
  project?: any;
  onSubmit: (data: any) => void;
}

export function ProjectDetails({ project, onSubmit }: ProjectDetailsProps) {
  const form = useForm({
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
    <Card className="p-6 max-w-2xl mx-auto bg-white/50 backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right block">عنوان المشروع</FormLabel>
                <FormControl>
                  <Input {...field} className="text-right" />
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
                <FormLabel className="text-right block">وصف المشروع</FormLabel>
                <FormControl>
                  <Textarea {...field} className="text-right min-h-[100px]" />
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
                <FormLabel className="text-right block">المبلغ المستهدف (ريال)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={1000}
                    className="text-right"
                  />
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
                <FormLabel className="text-right block">تصنيف المشروع</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر تصنيف المشروع" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROJECT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_investment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right block">الحد الأدنى للاستثمار (ريال)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={1000}
                    className="text-right"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            متابعة لدفع الرسوم
          </Button>
        </form>
      </Form>
    </Card>
  );
}