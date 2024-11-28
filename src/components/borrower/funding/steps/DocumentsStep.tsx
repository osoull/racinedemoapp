import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentsStepProps {
  control: Control<any>;
}

export function DocumentsStep({ control }: DocumentsStepProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    onChange: (value: string) => void
  ) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('funding-requests')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('funding-requests')
        .getPublicUrl(filePath);

      onChange(publicUrl);

      toast({
        title: "تم رفع الملف",
        description: "تم رفع الملف بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفع الملف",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="business_plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>خطة العمل *</FormLabel>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, "business_plan", field.onChange)}
                className="hidden"
                id="business_plan"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("business_plan")?.click()}
                disabled={uploading}
              >
                <Upload className="ml-2 h-4 w-4" />
                رفع الملف
              </Button>
              {field.value && (
                <span className="text-sm text-muted-foreground">
                  تم رفع الملف
                </span>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="financial_statements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>القوائم المالية *</FormLabel>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.xls,.xlsx"
                onChange={(e) => handleFileUpload(e, "financial_statements", field.onChange)}
                className="hidden"
                id="financial_statements"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("financial_statements")?.click()}
                disabled={uploading}
              >
                <Upload className="ml-2 h-4 w-4" />
                رفع الملف
              </Button>
              {field.value && (
                <span className="text-sm text-muted-foreground">
                  تم رفع الملف
                </span>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="additional_documents"
        render={({ field }) => (
          <FormItem>
            <FormLabel>مستندات إضافية</FormLabel>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => handleFileUpload(e, "additional_documents", field.onChange)}
                className="hidden"
                id="additional_documents"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("additional_documents")?.click()}
                disabled={uploading}
              >
                <Upload className="ml-2 h-4 w-4" />
                رفع الملف
              </Button>
              {field.value && (
                <span className="text-sm text-muted-foreground">
                  تم رفع الملف
                </span>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}