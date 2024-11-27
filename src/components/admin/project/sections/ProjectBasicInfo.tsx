import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectFormValues } from "./ProjectForm";

interface ProjectBasicInfoProps {
  control: Control<ProjectFormValues>;
}

export function ProjectBasicInfo({ control }: ProjectBasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">معلومات عامة</h3>
      <div className="space-y-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان المشروع *</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>تصنيف المشروع *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تصنيف المشروع" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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

        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>موقع المشروع *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}