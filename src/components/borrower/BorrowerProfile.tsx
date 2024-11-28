import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileStatus } from "@/components/profile/ProfileStatus"
import { AvatarUpload } from "@/components/AvatarUpload"

export function BorrowerProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">الملف التعريفي</h2>
        <AvatarUpload />
      </div>

      <div className="space-y-6">
        <ProfileHeader />
        <ProfileStatus />
        <Card>
          <CardHeader>
            <CardTitle>معلومات الشركة والممثل القانوني</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}