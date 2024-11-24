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
import { User } from "@/types/user";

type UserCardProps = {
  user: User;
  onDelete: (user: User) => void;
  onUpdateType: (userId: string, newType: string) => void;
  onEdit: (userId: string, updatedData: Partial<User>) => void;
};

export function UserCard({ user, onDelete, onUpdateType, onEdit }: UserCardProps) {
  const fullName = [
    user.first_name,
    user.middle_name,
    user.last_name
  ].filter(Boolean).join(" ");

  return (
    <Card className="w-full h-full p-4 transition-all hover:shadow-md">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col flex-grow min-w-0">
            <h3 className="text-base font-semibold truncate text-right">{fullName}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1 justify-end">
              <span className="truncate">{user.email}</span>
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 mr-4">
            <Button
              variant="destructive"
              size="icon"
              className="h-9 w-9"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <UserCog className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onUpdateType(user.id, "investor")} className="text-sm">
                  تعيين كمستثمر
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateType(user.id, "investment_manager")} className="text-sm">
                  تعيين كمدير استثمار
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateType(user.id, "admin")} className="text-sm">
                  تعيين كمشرف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <EditUserDialog user={user} onSave={onEdit} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <UserTypeLabel type={user.user_type} />
          <KycStatusLabel status={user.kyc_status} />
        </div>
      </div>
    </Card>
  );
}