import { UserCard } from "./UserCard";
import { TabsContent } from "@/components/ui/tabs";

type User = {
  id: string;
  email: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  user_type: string | null;
  kyc_status: string | null;
};

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

  return (
    <>
      <TabsContent value="all" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users?.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={onDelete}
              onUpdateType={onUpdateType}
              onEdit={onEdit}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="investor" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filterUsersByType("investor").map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={onDelete}
              onUpdateType={onUpdateType}
              onEdit={onEdit}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="investment_manager" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filterUsersByType("investment_manager").map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={onDelete}
              onUpdateType={onUpdateType}
              onEdit={onEdit}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="admin" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filterUsersByType("admin").map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={onDelete}
              onUpdateType={onUpdateType}
              onEdit={onEdit}
            />
          ))}
        </div>
      </TabsContent>
    </>
  );
}