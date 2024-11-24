import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Wallet, ShieldCheck, Users } from "lucide-react";
import CommissionManagement from "../CommissionManagement";
import UserManagement from "../UserManagement";

interface PlatformSettingsProps {
  section?: string;
}

const PlatformSettings = ({ section = "general" }: PlatformSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات المنصة</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={section} className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 ml-2" />
              الإعدادات العامة
            </TabsTrigger>
            <TabsTrigger value="commissions">
              <Wallet className="h-4 w-4 ml-2" />
              العمولات
            </TabsTrigger>
            <TabsTrigger value="security">
              <ShieldCheck className="h-4 w-4 ml-2" />
              الأمان
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 ml-2" />
              المستخدمين
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-4">
              {/* General platform settings content */}
            </div>
          </TabsContent>

          <TabsContent value="commissions">
            <CommissionManagement />
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-4">
              {/* Security settings content */}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PlatformSettings;