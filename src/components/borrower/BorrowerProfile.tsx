import { Card } from "@/components/ui/card"
import { AvatarUpload } from "@/components/AvatarUpload"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { BorrowerDashboardLayout } from "./BorrowerDashboardLayout"

export function BorrowerProfile() {
  return (
    <BorrowerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الملف التعريفي</h2>
          <p className="text-muted-foreground">
            إدارة وتحديث معلومات الملف الشخصي
          </p>
        </div>

        <div className="flex justify-end">
          <AvatarUpload />
        </div>

        <Card className="p-6">
          <ProfileForm />
        </Card>
      </div>
    </BorrowerDashboardLayout>
  )
}