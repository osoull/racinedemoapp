import { Tables } from "@/integrations/supabase/types";
import { ProjectDetails } from "./project/ProjectDetails";
import { ProjectPaymentStep } from "./project/ProjectPaymentStep";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFormProps {
  project?: Tables<"projects"> | null;
  onSuccess?: () => void;
}

export const ProjectForm = ({ project, onSuccess }: ProjectFormProps) => {
  const [step, setStep] = useState<"details" | "payment">("details");
  const [projectData, setProjectData] = useState<any>(null);

  const { data: commissions } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select("*")
      
      if (error) throw error
      return data
    },
  });

  const adminFee = commissions?.find(c => c.commission_type === 'admin_fee')?.rate || 0;
  const collectionFee = commissions?.find(c => c.commission_type === 'collection_fee')?.rate || 0;

  const handleProjectSubmit = (data: any) => {
    setProjectData(data);
    setStep("payment");
  };

  const fees = {
    admin: projectData ? (projectData.funding_goal * adminFee) / 100 : 0,
    collection: projectData ? (projectData.funding_goal * collectionFee) / 100 : 0,
    total: projectData ? ((projectData.funding_goal * (adminFee + collectionFee)) / 100) : 0
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
    <ProjectDetails 
      project={project} 
      onSubmit={handleProjectSubmit} 
    />
  );
};