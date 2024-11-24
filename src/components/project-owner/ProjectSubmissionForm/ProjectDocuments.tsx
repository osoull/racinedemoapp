import { ProjectDocumentUpload } from "@/components/admin/project/ProjectDocumentUpload";

export const ProjectDocuments = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">المستندات المطلوبة *</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectDocumentUpload
          title="خطة العمل"
          description="يرجى رفع الملف بصيغة PDF"
          type="presentation"
        />

        <ProjectDocumentUpload
          title="دراسة السوق"
          description="يرجى رفع الملف بصيغة PDF"
          type="feasibility"
        />

        <ProjectDocumentUpload
          title="وثائق الامتثال الشرعي"
          description="يرجى رفع الملف بصيغة PDF"
          type="financial"
        />
      </div>
    </div>
  );
};