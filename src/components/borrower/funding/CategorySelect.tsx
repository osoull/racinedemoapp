import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Control } from "react-hook-form"

const categories = [
  { id: "technology", label: "تقنية" },
  { id: "real_estate", label: "عقارات" },
  { id: "healthcare", label: "رعاية صحية" },
  { id: "education", label: "تعليم" },
  { id: "retail", label: "تجارة تجزئة" },
  { id: "manufacturing", label: "تصنيع" },
  { id: "services", label: "خدمات" },
  { id: "other", label: "أخرى" },
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
              <SelectTrigger className="text-right" dir="rtl">
                <SelectValue placeholder="اختر تصنيف" />
              </SelectTrigger>
            </FormControl>
            <SelectContent align="end" className="text-right" dir="rtl">
              {categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  className="text-right"
                >
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