import { FC } from 'react';
import { UserList } from './UserList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserDialog } from './CreateUserDialog';
import { useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/hooks/useUsers';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { AdminSidebar } from './AdminSidebar';
import { User } from '@/types/user';

interface UserManagementProps {
  userType?: 'investor' | 'borrower';
}

const UserManagement: FC<UserManagementProps> = ({ userType }) => {
  const queryClient = useQueryClient();
  const { users, isLoading, deleteUser } = useUsers(userType || 'investor');

  const handleUserCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const handleUpdateType = async (userId: string, newType: string) => {
    // Implement user type update logic here
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const handleEdit = async (userId: string, updatedData: any) => {
    // Implement user edit logic here
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const handleDelete = (user: User) => {
    deleteUser(user.id);
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>إدارة المستخدمين</CardTitle>
          <CreateUserDialog onUserCreated={handleUserCreated} />
        </CardHeader>
        <CardContent>
          <UserList 
            users={users} 
            onDelete={handleDelete}
            onUpdateType={handleUpdateType}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default UserManagement;