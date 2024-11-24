import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LicenseCard } from "./license/LicenseCard";
import type { PlatformLicense } from "./license/types";

export function PlatformLicenses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLicense, setSelectedLicense] = useState<PlatformLicense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: licenses, isLoading } = useQuery({
    queryKey: ['platform-licenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_licenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PlatformLicense[];
    }
  });

  const updateLicenseMutation = useMutation({
    mutationFn: async (updatedLicense: PlatformLicense) => {
      const { error } = await supabase
        .from('platform_licenses')
        .update({
          license_type: updatedLicense.license_type,
          license_number: updatedLicense.license_number,
          issue_date: updatedLicense.issue_date,
          expiry_date: updatedLicense.expiry_date,
          status: updatedLicense.status,
        })
        .eq('id', updatedLicense.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-licenses'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث معلومات الترخيص بنجاح",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث معلومات الترخيص",
        variant: "destructive",
      });
      console.error("Error updating license:", error);
    },
  });

  const handleUpdateLicense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLicense) return;
    updateLicenseMutation.mutate(selectedLicense);
  };

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['platform-licenses'] });
  };

  return (
    <section className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">تراخيص منصة التمويل الجماعي</h3>
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center p-4">جاري التحميل...</div>
        ) : licenses?.map((license) => (
          <LicenseCard
            key={license.id}
            license={license}
            onEdit={(license) => {
              setSelectedLicense(license);
              setIsDialogOpen(true);
            }}
            onUploadSuccess={handleUploadSuccess}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل معلومات الترخيص</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateLicense} className="space-y-4">
            <div>
              <label className="text-sm font-medium">نوع الترخيص</label>
              <Input
                value={selectedLicense?.license_type}
                onChange={(e) =>
                  setSelectedLicense(prev =>
                    prev ? { ...prev, license_type: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">رقم الترخيص</label>
              <Input
                value={selectedLicense?.license_number}
                onChange={(e) =>
                  setSelectedLicense(prev =>
                    prev ? { ...prev, license_number: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">تاريخ الإصدار</label>
              <Input
                type="date"
                value={selectedLicense?.issue_date}
                onChange={(e) =>
                  setSelectedLicense(prev =>
                    prev ? { ...prev, issue_date: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">تاريخ الانتهاء</label>
              <Input
                type="date"
                value={selectedLicense?.expiry_date}
                onChange={(e) =>
                  setSelectedLicense(prev =>
                    prev ? { ...prev, expiry_date: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">الحالة</label>
              <select
                className="w-full border rounded-md p-2"
                value={selectedLicense?.status}
                onChange={(e) =>
                  setSelectedLicense(prev =>
                    prev ? { ...prev, status: e.target.value } : null
                  )
                }
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="expired">منتهي</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}