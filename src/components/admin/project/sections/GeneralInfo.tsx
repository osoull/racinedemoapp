import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

interface GeneralInfoProps {
  control: Control<any>;
}

export function GeneralInfo({ control }: GeneralInfoProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">معلومات المشروع الأساسية</h2>
        <p className="text-muted-foreground mb-6">
          يرجى تقديم المعلومات الأساسية عن مشروعك. كلما كانت المعلومات دقيقة وواضحة، زادت فرص نجاح المشروع.
        </p>
      </div>

      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>اسم المشروع *</FormLabel>
            <FormControl>
              <Input 
                placeholder="أدخل اسماً واضحاً ومميزاً لمشروعك" 
                {...field} 
                className="text-lg"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ملخص المشروع *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="اكتب ملخصاً موجزاً يصف مشروعك وأهدافه الرئيسية"
                className="min-h-[100px] text-lg"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="category"
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
              <FormLabel>موقع المشروع *</FormLabel>
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
  );
}