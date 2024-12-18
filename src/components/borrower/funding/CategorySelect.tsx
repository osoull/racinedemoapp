import { Control } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = [
  { value: "real_estate", label: "العقارات" },
  { value: "technology", label: "التكنولوجيا" },
  { value: "healthcare", label: "الرعاية الصحية" },
  { value: "education", label: "التعليم" },
  { value: "retail", label: "التجزئة" },
  { value: "manufacturing", label: "التصنيع" },
  { value: "services", label: "الخدمات" },
  { value: "agriculture", label: "الزراعة" },
  { value: "energy", label: "الطاقة" },
  { value: "other", label: "أخرى" },
]

interface CategorySelectProps {
  control: Control<any>
}

export function CategorySelect({ control }: CategorySelectProps) {
  return (
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
              {categories.map((category) => (
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
  )
}