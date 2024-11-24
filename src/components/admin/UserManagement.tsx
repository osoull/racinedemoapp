import { FC } from 'react';
import { UserList } from './UserList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserDialog } from './CreateUserDialog';
import { useQueryClient } from '@tanstack/react-query';

interface UserManagementProps {
  userType?: 'investor' | 'borrower';
}

const UserManagement: FC<UserManagementProps> = ({ userType }) => {
  const queryClient = useQueryClient();

  const handleUserCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة المستخدمين</CardTitle>
        <CreateUserDialog onUserCreated={handleUserCreated} />
      </CardHeader>
      <CardContent>
        <UserList users={[]} onDelete={() => {}} onUpdateType={() => {}} onEdit={() => {}} />
      </CardContent>
    </Card>
  );
};

export default UserManagement;