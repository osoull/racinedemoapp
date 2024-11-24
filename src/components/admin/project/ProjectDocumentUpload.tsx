import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) {
        toast({
          title: "خطأ",
          description: "لم يتم اختيار ملف",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      toast({
        title: "تم رفع الملف بنجاح",
        description: file.name,
      });

    } catch (error) {
      toast({
        title: "خطأ في رفع الملف",
        description: "حدث خطأ أثناء محاولة رفع الملف",
        variant: "destructive",
      });
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer relative">
      <input
        type="file"
        onChange={handleFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept=".pdf"
        disabled={uploading}
      />
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        {uploading && (
          <p className="text-sm text-primary">جاري الرفع...</p>
        )}
      </div>
    </Card>
  );
};