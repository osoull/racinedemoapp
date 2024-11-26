import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoProps {
  control: Control<any>;
}

export function AdditionalInfo({ control }: AdditionalInfoProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="additional_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ملاحظات إضافية</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="أي معلومات إضافية ترغب في إضافتها"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}