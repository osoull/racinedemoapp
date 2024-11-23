import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const UserManagement = () => {
  const [userType, setUserType] = useState<"investor" | "project_owner">("investor");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", userType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          national_id,
          kyc_status,
          user_type,
          created_at
        `)
        .eq("user_type", userType);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المستخدمين</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="investors" className="space-y-4">
          <TabsList>
            <TabsTrigger 
              value="investors" 
              onClick={() => setUserType("investor")}
            >
              المستثمرين
            </TabsTrigger>
            <TabsTrigger 
              value="project_owners"
              onClick={() => setUserType("project_owner")}
            >
              أصحاب المشاريع
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investors">
            {isLoading ? (
              <div>جاري التحميل...</div>
            ) : (
              <div className="space-y-4">
                {users?.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="project_owners">
            {isLoading ? (
              <div>جاري التحميل...</div>
            ) : (
              <div className="space-y-4">
                {users?.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const UserCard = ({ user }: { user: any }) => {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-4">
        <div>
          <h3 className="font-semibold">{user.full_name}</h3>
          <p className="text-sm text-gray-500">
            رقم الهوية: {user.national_id}
          </p>
          <p className="text-sm text-gray-500">
            حالة KYC: {user.kyc_status}
          </p>
        </div>
        <div className="space-x-2">
          {/* Add action buttons here */}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;