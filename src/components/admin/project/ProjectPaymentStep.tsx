import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CreditCard } from "lucide-react";
import { BankTransferDetails } from "@/components/investor/wallet/deposit/BankTransferDetails";
import { CardPayment } from "@/components/investor/wallet/deposit/CardPayment";
import { ProjectFeeBreakdown } from "./ProjectFeeBreakdown";
import { useBankDetails } from "@/hooks/useBankDetails";

interface ProjectPaymentStepProps {
  projectData: any;
  fees: {
    admin: number;
    collection: number;
    total: number;
  };
  onBankTransfer: () => void;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const ProjectPaymentStep = ({
  projectData,
  fees,
  onBankTransfer,
  onPaymentSuccess,
  onBack,
}: ProjectPaymentStepProps) => {
  const { data: bankDetails, isLoading, error } = useBankDetails();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">دفع الرسوم</h2>
        <span className="text-sm text-muted-foreground">الخطوة 2 من 2</span>
      </div>
      
      <ProjectFeeBreakdown amount={projectData.funding_goal} fees={fees} />
      
      <div className="space-y-4">
        <h3 className="font-semibold">طريقة الدفع</h3>
        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bank" className="space-x-2">
              <Building2 className="h-4 w-4" />
              <span>تحويل بنكي</span>
            </TabsTrigger>
            <TabsTrigger value="card" className="space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>بطاقة ائتمان</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="space-y-4">
            <Alert>
              <AlertDescription>
                يرجى استخدام المعلومات البنكية أدناه لإتمام التحويل. سيتم تحديث رصيدك تلقائياً خلال يوم عمل واحد بعد استلام وتأكيد التحويل.
              </AlertDescription>
            </Alert>
            <BankTransferDetails 
              bankDetails={bankDetails}
              isLoading={isLoading}
              error={error}
            />
            <Button 
              onClick={onBankTransfer} 
              className="w-full"
              disabled={!bankDetails}
            >
              تأكيد التحويل البنكي
            </Button>
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <Alert>
              <AlertDescription>
                سيتم تحويلك إلى صفحة الدفع الآمنة لإتمام العملية
              </AlertDescription>
            </Alert>
            <CardPayment 
              amount={fees.total.toString()} 
              onSuccess={onPaymentSuccess}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Button 
        variant="outline" 
        onClick={onBack}
        className="w-full mt-4"
      >
        العودة للخطوة السابقة
      </Button>
    </div>
  );
};