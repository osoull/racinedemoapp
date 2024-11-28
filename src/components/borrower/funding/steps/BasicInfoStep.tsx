import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  { id: "technology", label: "تقنية" },
  { id: "real_estate", label: "عقارات" },
  { id: "healthcare", label: "رعاية صحية" },
  { id: "education", label: "تعليم" },
  { id: "retail", label: "تجارة تجزئة" },
  { id: "manufacturing", label: "تصنيع" },
  { id: "services", label: "خدمات" },
  { id: "other", label: "أخرى" },
];

interface BasicInfoStepProps {
  control: Control<any>;
}

export function BasicInfoStep({ control }: BasicInfoStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>عنوان المشروع *</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>التصنيف *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="اختر تصنيف" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
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
        name="funding_goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>المبلغ المطلوب (ريال) *</FormLabel>
            <Input 
              type="number" 
              {...field} 
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="campaign_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>مدة الحملة (بالأيام) *</FormLabel>
            <Input 
              type="number" 
              {...field} 
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="col-span-2">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المشروع *</FormLabel>
              <Textarea {...field} rows={5} />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-2">
        <FormField
          control={control}
          name="fund_usage_plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>خطة استخدام التمويل *</FormLabel>
              <Textarea {...field} rows={5} />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}