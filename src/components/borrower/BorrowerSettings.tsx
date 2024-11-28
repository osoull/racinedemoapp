import { AvatarUpload } from "@/components/AvatarUpload";
import { UserProfileInfo } from "@/components/UserProfileInfo";
import { Separator } from "@/components/ui/separator";

export function BorrowerSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إعدادات الحساب</h2>
        <p className="text-muted-foreground mt-2">
          قم بإدارة إعدادات حسابك وتحديث معلوماتك الشخصية
        </p>
      </div>

      <Separator />

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">الصورة الشخصية</h3>
          <AvatarUpload />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">معلومات الحساب</h3>
          <UserProfileInfo />
        </div>
      </div>
    </div>
  );
}