import { Control } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CreditCard } from "lucide-react";
import { BankTransferDetails } from "@/components/investor/wallet/deposit/BankTransferDetails";
import { CardPayment } from "@/components/investor/wallet/deposit/CardPayment";
import { ProjectFeeDetails } from "@/components/admin/project/ProjectFeeDetails";
import { useBankDetails } from "@/hooks/useBankDetails";

interface PaymentStepProps {
  amount: number;
  control: Control<any>;
}

export function PaymentStep({ amount, control }: PaymentStepProps) {
  const { data: bankDetails, isLoading, error } = useBankDetails();

  return (
    <div className="space-y-6">
      <ProjectFeeDetails amount={amount} />
      
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
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <Alert>
              <AlertDescription>
                سيتم تحويلك إلى صفحة الدفع الآمنة لإتمام العملية
              </AlertDescription>
            </Alert>
            <CardPayment 
              amount={amount.toString()} 
              onSuccess={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}