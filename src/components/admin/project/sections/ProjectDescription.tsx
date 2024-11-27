import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectDescriptionProps {
  control: Control<any>;
}

export function ProjectDescription({ control }: ProjectDescriptionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">تفاصيل المشروع</h2>
        <p className="text-muted-foreground mb-6">
          قدم وصفاً شاملاً لمشروعك وقيمته المضافة. هذه المعلومات ستساعد المستثمرين في فهم فرصة الاستثمار بشكل أفضل.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">الأهداف الرئيسية</h3>
          </div>
          <FormField
            control={control}
            name="objectives"
            render={({ field }) => (
              <FormItem>
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
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة هدف جديد
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">المشكلة والحل</h3>
          </div>
          <div className="space-y-6">
            <FormField
              control={control}
              name="problem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المشكلة التي يعالجها المشروع *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="صف المشكلة أو الحاجة التي يلبيها مشروعك"
                      className="min-h-[100px] text-lg"
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
                      placeholder="اشرح كيف يقدم مشروعك حلاً للمشكلة المذكورة"
                      className="min-h-[100px] text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">الأثر والنتائج المتوقعة</h3>
          </div>
          <FormField
            control={control}
            name="impact"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="صف الأثر المتوقع لمشروعك على السوق والمجتمع"
                    className="min-h-[150px] text-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
      </div>
    </div>
  );
}