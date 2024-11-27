import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProjectBasicInfo } from "./project/sections/ProjectBasicInfo";
import { ProjectDescription } from "./project/sections/ProjectDescription";
import { FinancialDetails } from "./project/sections/FinancialDetails";
import { ProjectDocuments } from "./project/sections/ProjectDocuments";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectPaymentStep } from "./project/ProjectPaymentStep";
import { FileText, Coins, Upload, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects"> & {
  owner?: {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
  };
  risk_rating?: string | null;
  risk_description?: string | null;
};

export interface ProjectFormProps {
  project?: Project | null;
  onSuccess?: () => void;
}

export const ProjectForm = ({ project, onSuccess }: ProjectFormProps) => {
  const [step, setStep] = useState<"details" | "payment">("details");
  const [projectData, setProjectData] = useState<any>(null);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: project || {}
  });

  const { data: commissions } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("commissions").select("*");
      if (error) throw error;
      return data;
    },
  });

  const adminFee =
    commissions?.find((c) => c.commission_type === "admin_fee")?.rate || 0;
  const collectionFee =
    commissions?.find((c) => c.commission_type === "collection_fee")?.rate || 0;

  const handleProjectSubmit = async (data: any) => {
    try {
      const { data: projectResponse, error: projectError } = await supabase
        .from("projects")
        .upsert({
          ...data,
          id: project?.id,
          owner_id: (await supabase.auth.getUser()).data.user?.id,
          status: project ? project.status : "draft",
        })
        .select()
        .single();

      if (projectError) throw projectError;

      setProjectData(projectResponse);
      setStep("payment");
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء المشروع",
        variant: "destructive",
      });
    }
  };

  const fees = {
    admin: projectData ? (projectData.funding_goal * adminFee) / 100 : 0,
    collection: projectData ? (projectData.funding_goal * collectionFee) / 100 : 0,
    total: projectData
      ? (projectData.funding_goal * (adminFee + collectionFee)) / 100
      : 0,
  };

  if (step === "payment" && projectData) {
    return (
      <ProjectPaymentStep
        projectData={projectData}
        fees={fees}
        onBankTransfer={onSuccess}
        onPaymentSuccess={onSuccess}
        onBack={() => setStep("details")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{project ? 'تعديل المشروع' : 'إنشاء مشروع جديد'}</h2>
        <p className="text-muted-foreground mt-2">
          قم بملء المعلومات التالية {project ? 'لتعديل' : 'لإنشاء'} مشروعك
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="space-x-2">
            <Building2 className="w-4 h-4" />
            <span>معلومات أساسية</span>
          </TabsTrigger>
          <TabsTrigger value="description" className="space-x-2">
            <FileText className="w-4 h-4" />
            <span>وصف المشروع</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="space-x-2">
            <Coins className="w-4 h-4" />
            <span>التفاصيل المالية</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="space-x-2">
            <Upload className="w-4 h-4" />
            <span>المستندات</span>
          </TabsTrigger>
        </TabsList>

        <form onSubmit={form.handleSubmit(handleProjectSubmit)} className="mt-8 space-y-8">
          <TabsContent value="basic">
            <ProjectBasicInfo control={form.control} project={project} />
          </TabsContent>

          <TabsContent value="description">
            <ProjectDescription control={form.control} project={project} />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialDetails control={form.control} project={project} />
          </TabsContent>

          <TabsContent value="documents">
            <ProjectDocuments control={form.control} />
          </TabsContent>

          <div className="flex justify-end pt-6 border-t">
            <Button type="submit" size="lg">
              {project ? 'حفظ التغييرات' : 'متابعة لدفع الرسوم'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};