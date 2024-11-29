import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategorySelect } from "../CategorySelect";

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
            <FormControl>
              <Input {...field} className="text-right" dir="rtl" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <CategorySelect control={control} />

      <FormField
        control={control}
        name="funding_goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>المبلغ المطلوب (ريال) *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="text-right"
                dir="rtl"
              />
            </FormControl>
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
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="text-right"
                dir="rtl"
              />
            </FormControl>
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
              <FormControl>
                <Textarea {...field} rows={5} className="text-right" dir="rtl" />
              </FormControl>
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
              <FormControl>
                <Textarea {...field} rows={5} className="text-right" dir="rtl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}