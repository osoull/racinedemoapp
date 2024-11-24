import { FileCheck2, AlertCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { LicenseUploadButton } from "./LicenseUploadButton";
import type { PlatformLicense } from "./types";

interface LicenseCardProps {
  license: PlatformLicense;
  onEdit: (license: PlatformLicense) => void;
  onUploadSuccess: () => void;
}

export function LicenseCard({ license, onEdit, onUploadSuccess }: LicenseCardProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ar });
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="font-medium">{license.license_type}</p>
        <p className="text-sm text-muted-foreground">
          رقم الترخيص: {license.license_number}
        </p>
        <p className="text-sm text-muted-foreground">
          صالح حتى: {formatDate(license.expiry_date)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {license.status === 'active' ? (
          <FileCheck2 className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-yellow-500" />
        )}
        <LicenseUploadButton 
          licenseId={license.id} 
          onUploadSuccess={onUploadSuccess}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(license)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}