import { UserCard } from "./UserCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/user";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

type UserListProps = {
  users: User[] | undefined;
  onDelete: (user: User) => void;
  onUpdateType: (userId: string, newType: string) => void;
  onEdit: (userId: string, updatedData: Partial<User>) => void;
};

export function UserList({ users, onDelete, onUpdateType, onEdit }: UserListProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set up realtime subscription
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          // Invalidate and refetch users query when changes occur
          queryClient.invalidateQueries({ queryKey: ['users'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const filterUsersByType = (type: string | null) => {
    if (!type) return users || [];
    return users?.filter(user => user.user_type === type) || [];
  };

  const UserGrid = ({ filteredUsers }: { filteredUsers: User[] }) => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
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
    <div className="w-full space-y-6" dir="rtl">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">جميع المستخدمين</TabsTrigger>
          <TabsTrigger value="investor">المستثمرون</TabsTrigger>
          <TabsTrigger value="investment_manager">مديرو الاستثمار</TabsTrigger>
          <TabsTrigger value="admin">المشرفون</TabsTrigger>
          <TabsTrigger value="borrower">طالبو التمويل</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <UserGrid filteredUsers={filterUsersByType(null)} />
        </TabsContent>

        <TabsContent value="investor">
          <UserGrid filteredUsers={filterUsersByType("investor")} />
        </TabsContent>

        <TabsContent value="investment_manager">
          <UserGrid filteredUsers={filterUsersByType("investment_manager")} />
        </TabsContent>

        <TabsContent value="admin">
          <UserGrid filteredUsers={filterUsersByType("admin")} />
        </TabsContent>

        <TabsContent value="borrower">
          <UserGrid filteredUsers={filterUsersByType("borrower")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}