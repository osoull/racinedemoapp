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
  first_name: string;
  middle_name: string | null;
  last_name: string;
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
    .join(" ");

  return (
    <Card className="p-3 sm:p-4 transition-all hover:shadow-md">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="text-sm sm:text-base font-semibold">{fullName}</h3>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <EditUserDialog user={user} onSave={onEdit} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <UserCog className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56">
                <DropdownMenuItem onClick={() => onUpdateType(user.id, "investor")} className="text-xs sm:text-sm">
                  تعيين كمستثمر
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateType(user.id, "investment_manager")} className="text-xs sm:text-sm">
                  تعيين كمدير استثمار
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateType(user.id, "admin")} className="text-xs sm:text-sm">
                  تعيين كمشرف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <UserTypeLabel type={user.user_type} />
          <KycStatusLabel status={user.kyc_status} />
        </div>
      </div>
    </Card>
  );
}