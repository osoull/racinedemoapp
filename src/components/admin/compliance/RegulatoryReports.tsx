import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileCheck2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RegulatoryReport {
  id: string;
  title: string;
  file_url: string;
  upload_date: string;
}

export function RegulatoryReports() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");

  const { data: reports, isLoading } = useQuery({
    queryKey: ['regulatory-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regulatory_reports')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;
      return data as RegulatoryReport[];
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || !event.target.files[0]) return;
      if (!title) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال عنوان التقرير",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `regulatory-reports/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('regulatory-reports')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('regulatory_reports')
        .insert({
          title: title,
          file_url: filePath,
          upload_date: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      toast({
        title: "تم الرفع بنجاح",
        description: "تم رفع التقرير بنجاح",
      });
      
      queryClient.invalidateQueries({ queryKey: ['regulatory-reports'] });
      setTitle("");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفع التقرير",
        variant: "destructive",
      });
      console.error("Error uploading report:", error);
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ar });
  };

  return (
    <section className="border rounded-lg p-4">
      <h3 className="font-semibold mb-4">التقارير الرقابية</h3>
      
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="عنوان التقرير"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="report-upload"
              disabled={uploading}
            />
            <label htmlFor="report-upload">
              <Button asChild disabled={uploading}>
                <span>
                  {uploading ? (
                    "جاري الرفع..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      رفع تقرير
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center p-4">جاري التحميل...</div>
          ) : reports?.map((report) => (
            <div key={report.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-muted-foreground">
                    تم الرفع بتاريخ: {formatDate(report.upload_date)}
                  </p>
                </div>
                <FileCheck2 className="h-5 w-5 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}