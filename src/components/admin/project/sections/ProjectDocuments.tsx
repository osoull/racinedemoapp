import { Card } from "@/components/ui/card";
import { ProjectDocumentUpload } from "../ProjectDocumentUpload";
import { FileText, FileSpreadsheet, Presentation } from "lucide-react";

export function ProjectDocuments() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">المستندات المطلوبة</h3>
        <p className="text-sm text-muted-foreground mb-6">
          قم برفع المستندات التالية لدعم طلب مشروعك. جميع الملفات يجب أن تكون بصيغة PDF.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProjectDocumentUpload
            title="العرض التقديمي"
            description="عرض تفصيلي للمشروع وخطة العمل"
            type="presentation"
          />
          <ProjectDocumentUpload
            title="دراسة الجدوى"
            description="تحليل تفصيلي لجدوى المشروع"
            type="feasibility"
          />
          <ProjectDocumentUpload
            title="النموذج المالي"
            description="التوقعات والتحليلات المالية"
            type="financial"
          />
        </div>
      </Card>
    </div>
  );
}