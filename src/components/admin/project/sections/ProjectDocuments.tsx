import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface ProjectDocumentsProps {
  control: Control<any>;
}

export function ProjectDocuments({ control }: ProjectDocumentsProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold">المستندات المطلوبة</h3>
            <p className="text-sm text-muted-foreground">
              قم بتحميل المستندات المطلوبة للمشروع
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <FormField
            control={control}
            name="business_plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>خطة العمل</FormLabel>
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="financial_projections"
            render={({ field }) => (
              <FormItem>
                <FormLabel>التوقعات المالية</FormLabel>
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input type="file" multiple {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    </div>
  );
}