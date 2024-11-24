import { UserCard } from "./UserCard";
import { TabsContent } from "@/components/ui/tabs";
import { User } from "@/types/user";

type UserListProps = {
  users: User[] | undefined;
  onDelete: (user: User) => void;
  onUpdateType: (userId: string, newType: string) => void;
  onEdit: (userId: string, updatedData: Partial<User>) => void;
};

export function UserList({ users, onDelete, onUpdateType, onEdit }: UserListProps) {
  const filterUsersByType = (type: string) => {
    return users?.filter(user => user.user_type === type) || [];
  };

  const UserGrid = ({ filteredUsers }: { filteredUsers: User[] }) => (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredUsers.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onDelete={onDelete}
          onUpdateType={onUpdateType}
          onEdit={onEdit}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <TabsContent value="all" className="mt-4 sm:mt-6">
        <UserGrid filteredUsers={users || []} />
      </TabsContent>

      <TabsContent value="investor" className="mt-4 sm:mt-6">
        <UserGrid filteredUsers={filterUsersByType("investor")} />
      </TabsContent>

      <TabsContent value="investment_manager" className="mt-4 sm:mt-6">
        <UserGrid filteredUsers={filterUsersByType("investment_manager")} />
      </TabsContent>

      <TabsContent value="admin" className="mt-4 sm:mt-6">
        <UserGrid filteredUsers={filterUsersByType("admin")} />
      </TabsContent>
    </div>
  );
}