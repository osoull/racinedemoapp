import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Target, Lightbulb, TrendingUp } from "lucide-react";

interface ProjectDescriptionProps {
  project?: any;
}

export function ProjectDescription({ project }: ProjectDescriptionProps) {
  return (
    <div className="space-y-8">
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">الأهداف الرئيسية</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>الهدف الرئيسي</Label>
            <Input placeholder="ما هو الهدف الرئيسي لمشروعك؟" />
          </div>
          <Button type="button" variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            إضافة هدف آخر
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-orange-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold">المشكلة والحل</h3>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>المشكلة التي يعالجها المشروع</Label>
            <Textarea
              placeholder="صف المشكلة أو الحاجة التي يلبيها مشروعك"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label>الحل المقترح</Label>
            <Textarea
              placeholder="اشرح كيف يقدم مشروعك حلاً للمشكلة المذكورة"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">الأثر والنتائج المتوقعة</h3>
        </div>
        <div className="space-y-2">
          <Label>الأثر المتوقع</Label>
          <Textarea
            placeholder="صف الأثر المتوقع لمشروعك على السوق والمجتمع"
            className="min-h-[150px]"
          />
        </div>
      </Card>
    </div>
  );
}