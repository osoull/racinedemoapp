import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileStatus } from "@/components/profile/ProfileStatus"
import { CompanyOverview } from "./profile/CompanyOverview"
import { DocumentsManagement } from "./profile/DocumentsManagement"
import { AvatarUpload } from "@/components/AvatarUpload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
        
        <Tabs defaultValue="overview" dir="rtl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="documents">المستندات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <CompanyOverview />
            <Card>
              <CardHeader>
                <CardTitle>معلومات الشركة والممثل القانوني</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}