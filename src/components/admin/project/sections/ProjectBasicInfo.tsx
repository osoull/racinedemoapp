import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoIcon } from "lucide-react";

const PROJECT_CATEGORIES = [
  { value: "real_estate", label: "مشاريع عقارية" },
  { value: "technology", label: "تقنية المعلومات" },
  { value: "healthcare", label: "الرعاية الصحية" },
  { value: "education", label: "التعليم" },
  { value: "retail", label: "التجزئة" },
  { value: "manufacturing", label: "التصنيع" },
  { value: "services", label: "الخدمات" },
  { value: "agriculture", label: "الزراعة" },
];

interface ProjectBasicInfoProps {
  project?: any;
}

export function ProjectBasicInfo({ project }: ProjectBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <InfoIcon className="w-5 h-5 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">المعلومات الأساسية</h3>
              <p className="text-sm text-muted-foreground">
                هذه المعلومات ستكون ظاهرة للمستثمرين المحتملين. تأكد من أن تكون دقيقة وواضحة.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>عنوان المشروع</Label>
            <Input
              placeholder="أدخل عنواناً واضحاً ومميزاً لمشروعك"
              defaultValue={project?.title}
            />
          </div>

          <div className="space-y-2">
            <Label>تصنيف المشروع</Label>
            <Select defaultValue={project?.classification}>
              <SelectTrigger>
                <SelectValue placeholder="اختر تصنيف المشروع" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>موقع المشروع</Label>
            <Input
              placeholder="المدينة أو المنطقة الرئيسية للمشروع"
              defaultValue={project?.location}
            />
          </div>
        </div>
      </div>
    </div>
  );
}