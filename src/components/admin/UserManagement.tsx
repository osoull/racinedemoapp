import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserType } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { UserCard } from "./UserCard";

const UserManagement = () => {
  const [userType, setUserType] = useState<UserType>("investor");
  const { users, isLoading, deleteUser } = useUsers(userType);

  const handleEdit = (user: any) => {
    // Implémenter la logique d'édition
    console.log("Edit user:", user);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المستخدمين</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="investors" className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4">
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
            <TabsTrigger 
              value="investment_managers"
              onClick={() => setUserType("investment_manager")}
            >
              مديري الاستثمار
            </TabsTrigger>
            <TabsTrigger 
              value="admins"
              onClick={() => setUserType("admin")}
            >
              المشرفين
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            {isLoading ? (
              <div>جاري التحميل...</div>
            ) : (
              users?.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user}
                  onDelete={deleteUser}
                  onEdit={handleEdit}
                />
              ))
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
