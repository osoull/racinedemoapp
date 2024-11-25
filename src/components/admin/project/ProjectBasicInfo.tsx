import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface ProjectBasicInfoProps {
  control: Control<any>;
}

export const ProjectBasicInfo = ({ control }: ProjectBasicInfoProps) => {
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>عنوان المشروع *</FormLabel>
            <FormControl>
              <Input {...field} className="text-right" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>وصف المشروع *</FormLabel>
            <FormControl>
              <Textarea {...field} className="min-h-[100px] text-right" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};