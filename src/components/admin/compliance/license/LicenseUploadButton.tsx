import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LicenseUploadButtonProps {
  licenseId: string;
  onUploadSuccess: () => void;
}

export function LicenseUploadButton({ licenseId, onUploadSuccess }: LicenseUploadButtonProps) {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || !event.target.files[0]) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `license-${licenseId}.${fileExt}`;
      const filePath = `platform-licenses/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('regulatory-reports')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      toast({
        title: "تم الرفع بنجاح",
        description: "تم رفع المستند بنجاح",
      });

      onUploadSuccess();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفع المستند",
        variant: "destructive",
      });
      console.error("Error uploading document:", error);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
        id={`license-upload-${licenseId}`}
      />
      <label htmlFor={`license-upload-${licenseId}`}>
        <Button variant="ghost" size="icon" asChild>
          <span>
            <Upload className="h-4 w-4" />
          </span>
        </Button>
      </label>
    </div>
  );
}