import { Control } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const PROJECT_CATEGORIES = [
  { value: "real_estate", label: "مشاريع عقارية" },
  { value: "technology", label: "تقنية المعلومات" },
  { value: "healthcare", label: "الرعاية الصحية" },
  { value: "education", label: "التعليم" },
  { value: "retail", label: "التجزئة" },
  { value: "manufacturing", label: "التصنيع" },
  { value: "services", label: "الخدمات" },
  { value: "agriculture", label: "الزراعة" },
];

export interface ProjectBasicInfoProps {
  control: Control<any>;
  project?: any;
}

export function ProjectBasicInfo({ control, project }: ProjectBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <InfoIcon className="w-5 h-5 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">المعلومات الأساسية</h3>
              <p className="text-sm text-muted-foreground">
                هذه المعلومات ستكون ظاهرة للمستثمرين المحتملين. تأكد من أن تكون دقيقة وواضحة.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عنوان المشروع</FormLabel>
                <FormControl>
                  <Input
                    placeholder="أدخل عنواناً واضحاً ومميزاً لمشروعك"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="classification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تصنيف المشروع</FormLabel>
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
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>موقع المشروع</FormLabel>
                <FormControl>
                  <Input
                    placeholder="المدينة أو المنطقة الرئيسية للمشروع"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}