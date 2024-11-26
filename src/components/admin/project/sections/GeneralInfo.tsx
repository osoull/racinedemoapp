import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const SAUDI_REGIONS = [
  { value: "riyadh", label: "الرياض" },
  { value: "makkah", label: "مكة المكرمة" },
  { value: "madinah", label: "المدينة المنورة" },
  { value: "eastern", label: "المنطقة الشرقية" },
  { value: "asir", label: "عسير" },
  { value: "tabuk", label: "تبوك" },
  { value: "hail", label: "حائل" },
  { value: "qassim", label: "القصيم" }
];

interface GeneralInfoProps {
  control: Control<any>;
}

export function GeneralInfo({ control }: GeneralInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان المشروع *</FormLabel>
              <FormControl>
                <Input placeholder="أدخل عنوان المشروع" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر موقع المشروع" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SAUDI_REGIONS.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}