import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlatformLicenses } from "./compliance/PlatformLicenses"
import { RegulatoryReports } from "./compliance/RegulatoryReports"

interface ComplianceAuditProps {
  tab?: string;
}

export function ComplianceAudit({ tab = "cma" }: ComplianceAuditProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">التحقق والامتثال</h2>
        <p className="text-muted-foreground">
          إدارة متطلبات الامتثال والتراخيص
        </p>
      </div>

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
    </div>
  )
}