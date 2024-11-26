import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";

interface PaymentSectionProps {
  control: Control<any>;
}

export function PaymentSection({ control }: PaymentSectionProps) {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>معلومات الدفع</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>رقم البطاقة</Label>
            <Input type="text" placeholder="**** **** **** ****" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>تاريخ الانتهاء</Label>
              <Input type="text" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label>رمز الأمان</Label>
              <Input type="text" placeholder="CVV" />
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
}