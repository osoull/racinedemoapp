import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile/ProfileForm"

export function BorrowerProfile() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">الملف التعريفي</h2>
      <Card>
        <CardHeader>
          <CardTitle>معلومات الشركة</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}