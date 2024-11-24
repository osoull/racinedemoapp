import { FC } from 'react';
import { UserList } from './UserList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserDialog } from './CreateUserDialog';

interface UserManagementProps {
  userType?: 'investor' | 'borrower';
}

const UserManagement: FC<UserManagementProps> = ({ userType }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة المستخدمين</CardTitle>
        <CreateUserDialog />
      </CardHeader>
      <CardContent>
        <UserList userType={userType} />
      </CardContent>
    </Card>
  );
};

export default UserManagement;