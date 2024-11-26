import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

interface ProjectDescriptionProps {
  control: Control<any>;
}

export function ProjectDescription({ control }: ProjectDescriptionProps) {
  return (
    <div className="space-y-8">
      <FormField
        control={control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ملخص المشروع *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="قدم ملخصاً موجزاً عن مشروعك"
                className="min-h-[150px] text-lg"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="objectives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الأهداف الرئيسية *</FormLabel>
            <div className="space-y-3">
              {field.value.map((_: any, index: number) => (
                <div key={index} className="flex gap-3">
                  <FormControl>
                    <Input
                      className="text-lg"
                      placeholder={`الهدف ${index + 1}`}
                      value={field.value[index]}
                      onChange={(e) => {
                        const newObjectives = [...field.value];
                        newObjectives[index] = e.target.value;
                        field.onChange(newObjectives);
                      }}
                    />
                  </FormControl>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newObjectives = [...field.value];
                        newObjectives.splice(index, 1);
                        field.onChange(newObjectives);
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => field.onChange([...field.value, ""])}
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة هدف
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="problem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>المشكلة المحددة *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="صف المشكلة التي يعالجها مشروعك"
                className="min-h-[150px] text-lg"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="solution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الحل المقترح *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="صف كيف يحل مشروعك المشكلة المحددة"
                className="min-h-[150px] text-lg"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="impact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الأثر المتوقع *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="صف الأثر المتوقع لمشروعك على المجتمع أو السوق المستهدف"
                className="min-h-[150px] text-lg"
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