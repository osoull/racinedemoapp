import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CreditCard } from "lucide-react";
import { BankTransferDetails } from "@/components/investor/wallet/deposit/BankTransferDetails";
import { CardPayment } from "@/components/investor/wallet/deposit/CardPayment";
import { ProjectFeeBreakdown } from "../ProjectFeeBreakdown";
import { useBankDetails } from "@/hooks/useBankDetails";

interface PaymentSectionProps {
  control: Control<any>;
}

export function PaymentSection({ control }: PaymentSectionProps) {
  const { data: bankDetails, isLoading, error } = useBankDetails();

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          يرجى اختيار طريقة الدفع المناسبة لإتمام عملية تسجيل المشروع
        </AlertDescription>
      </Alert>

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
          <BankTransferDetails 
            bankDetails={bankDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="card" className="space-y-4">
          <CardPayment amount="0" onSuccess={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
}