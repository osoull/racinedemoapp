import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface ProjectDocumentUploadProps {
  title: string;
  description: string;
  type: "presentation" | "feasibility" | "financial";
}

export const ProjectDocumentUpload = ({
  title,
  description,
  type,
}: ProjectDocumentUploadProps) => {
  return (
    <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};