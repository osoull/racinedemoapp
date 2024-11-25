import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface ProjectClassificationProps {
  control: Control<any>;
}

export const ProjectClassification = ({ control }: ProjectClassificationProps) => {
  return (
    <FormField
      control={control}
      name="classification"
      render={({ field }) => (
        <FormItem>
          <FormLabel>تصنيف المشروع *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر تصنيف المشروع" />
              </SelectTrigger>
            </FormControl>
            <SelectContent align="end" className="text-right">
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
  );
};