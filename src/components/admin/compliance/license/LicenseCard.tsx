import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlatformLicense } from "./types"
import { FileEdit, Upload } from "lucide-react"

interface LicenseCardProps {
  license: PlatformLicense
  onEdit: (license: PlatformLicense) => void
  onUploadSuccess: () => void
}

export function LicenseCard({ license, onEdit, onUploadSuccess }: LicenseCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {license.license_type}
        </CardTitle>
        <Badge
          variant={
            license.status === "active"
              ? "default"
              : license.status === "inactive"
              ? "secondary"
              : "destructive"
          }
        >
          {license.status === "active"
            ? "نشط"
            : license.status === "inactive"
            ? "غير نشط"
            : "منتهي"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">رقم الترخيص</label>
              <p className="mt-1">{license.license_number}</p>
            </div>
            <div>
              <label className="text-sm font-medium">تاريخ الإصدار</label>
              <p className="mt-1">{new Date(license.issue_date).toLocaleDateString("ar-SA")}</p>
            </div>
            <div>
              <label className="text-sm font-medium">تاريخ الانتهاء</label>
              <p className="mt-1">{new Date(license.expiry_date).toLocaleDateString("ar-SA")}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(license)}>
              <FileEdit className="h-4 w-4 ml-2" />
              تعديل
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 ml-2" />
              رفع المستند
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}