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
                <SelectValue className="text-right" placeholder="اختر تصنيف المشروع" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="text-right">
              <SelectItem className="text-right flex flex-row-reverse justify-between" value="تمويل مشاريع طرف ثاني">تمويل مشاريع طرف ثاني</SelectItem>
              <SelectItem className="text-right flex flex-row-reverse justify-between" value="تمويل الفواتير">تمويل الفواتير</SelectItem>
              <SelectItem className="text-right flex flex-row-reverse justify-between" value="تمويل رأس المال العامل">تمويل رأس المال العامل</SelectItem>
              <SelectItem className="text-right flex flex-row-reverse justify-between" value="تمويل التوسع">تمويل التوسع</SelectItem>
              <SelectItem className="text-right flex flex-row-reverse justify-between" value="تمويل المشاريع العقارية">تمويل المشاريع العقارية</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};