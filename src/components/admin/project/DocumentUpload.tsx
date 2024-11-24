import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadProps {
  title: string;
  description: string;
  type: string;
}

export const DocumentUpload = ({ title, description, type }: DocumentUploadProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-documents')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "خطأ في رفع الملف",
        description: "حدث خطأ أثناء محاولة رفع الملف",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم رفع الملف بنجاح",
    });
  };

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      <label className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-lg cursor-pointer hover:bg-secondary/20 transition-colors">
        <Upload className="h-4 w-4" />
        <span className="text-sm">رفع الملف</span>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};