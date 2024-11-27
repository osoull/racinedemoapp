import { Control } from "react-hook-form";
import { ProjectDocumentUpload } from "../ProjectDocumentUpload";

interface ProjectDocumentsProps {
  control: Control<any>;
}

export function ProjectDocuments({ control }: ProjectDocumentsProps) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold">المستندات المطلوبة *</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectDocumentUpload
          title="عرض تقديمي للمشروع"
          description="يرجى رفع الملف بصيغة PDF"
          type="presentation"
        />
        <ProjectDocumentUpload
          title="دراسة الجدوى"
          description="يرجى رفع الملف بصيغة PDF"
          type="feasibility"
        />
        <ProjectDocumentUpload
          title="التقرير المالي"
          description="يرجى رفع الملف بصيغة PDF"
          type="financial"
        />
      </div>
    </div>
  );
}