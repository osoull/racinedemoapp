import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformLicenses } from "./compliance/PlatformLicenses";
import { RegulatoryReports } from "./compliance/RegulatoryReports";

interface ComplianceAuditProps {
  tab?: string;
}

export function ComplianceAudit({ tab = "cma" }: ComplianceAuditProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>متطلبات هيئة السوق المالية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <PlatformLicenses />
          <RegulatoryReports />
        </div>
      </CardContent>
    </Card>
  );
}