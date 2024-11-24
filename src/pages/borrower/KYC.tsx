import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm";

const BorrowerKYC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>التحقق من الهوية - المقترض</CardTitle>
        </CardHeader>
        <CardContent>
          <BorrowerKYCForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowerKYC;