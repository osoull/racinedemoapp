import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ProjectFundingProps {
  control: Control<any>;
}

export const ProjectFunding = ({ control }: ProjectFundingProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="funding_goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>المبلغ المستهدف *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="text-right"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="min_investment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الحد الأدنى للاستثمار *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="text-right"
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">الحد الأدنى المسموح به: 10000 ريال</p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};