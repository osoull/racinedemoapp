import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProjectTimelineProps {
  control: Control<any>;
}

export function ProjectTimeline({ control }: ProjectTimelineProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>تاريخ البدء *</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>تاريخ الانتهاء المتوقع *</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}