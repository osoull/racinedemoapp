import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectFormValues } from "./types";

interface ProjectPreviewProps {
  values: ProjectFormValues;
  onEdit: () => void;
  onSubmit: () => void;
}

export const ProjectPreview = ({ values, onEdit, onSubmit }: ProjectPreviewProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{values.title}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">وصف المشروع</h3>
            <p className="text-gray-600">{values.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">المبلغ المستهدف</h3>
              <p className="text-gray-600">{values.funding_goal} ريال</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">الحد الأدنى للاستثمار</h3>
              <p className="text-gray-600">{values.min_investment} ريال</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">تصنيف المشروع</h3>
            <p className="text-gray-600">{values.classification}</p>
          </div>
        </div>
      </Card>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onEdit}>
          تعديل المشروع
        </Button>
        <Button onClick={onSubmit}>
          إرسال المشروع
        </Button>
      </div>
    </div>
  );
};