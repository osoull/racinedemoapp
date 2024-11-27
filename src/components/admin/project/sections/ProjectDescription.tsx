import { Control } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Target, Lightbulb, TrendingUp } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface ProjectDescriptionProps {
  control: Control<any>;
}

export function ProjectDescription({ control }: ProjectDescriptionProps) {
  return (
    <div className="space-y-8">
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
              <FormLabel>الهدف الرئيسي</FormLabel>
              <FormControl>
                <Input placeholder="ما هو الهدف الرئيسي لمشروعك؟" {...field} />
              </FormControl>
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
                <FormLabel>المشكلة التي يعالجها المشروع</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="صف المشكلة أو الحاجة التي يلبيها مشروعك"
                    className="min-h-[100px]"
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
                <FormLabel>الحل المقترح</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="اشرح كيف يقدم مشروعك حلاً للمشكلة المذكورة"
                    className="min-h-[100px]"
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
              <FormLabel>الأثر المتوقع</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="صف الأثر المتوقع لمشروعك على السوق والمجتمع"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Card>
    </div>
  );
}