import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, Trash2, UserCog } from "lucide-react";
import { UserTypeLabel } from "./UserTypeLabel";
import { KycStatusLabel } from "./KycStatusLabel";
import { EditUserDialog } from "./EditUserDialog";

type User = {
  id: string;
  email: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  user_type: string | null;
  kyc_status: string | null;
};

type UserCardProps = {
  user: User;
  onDelete: (user: User) => void;
  onUpdateType: (userId: string, newType: string) => void;
  onEdit: (userId: string, updatedData: Partial<User>) => void;
};

export function UserCard({ user, onDelete, onUpdateType, onEdit }: UserCardProps) {
  const fullName = [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(' ') || 'الاسم غير محدد';

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-semibold">{fullName}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="ml-2 h-4 w-4" />
              {user.email}
            </div>
          </div>
          <div className="flex space-x-2">
            <EditUserDialog user={user} onSave={onEdit} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <UserCog className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdateType(user.id, 'investor')}>
                  تعيين كمستثمر
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateType(user.id, 'investment_manager')}>
                  تعيين كمدير استثمار
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateType(user.id, 'admin')}>
                  تعيين كمشرف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <UserTypeLabel type={user.user_type} />
          <KycStatusLabel status={user.kyc_status} />
        </div>
      </div>
    </Card>
  );
}