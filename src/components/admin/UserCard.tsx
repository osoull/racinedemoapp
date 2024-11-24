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
    <Card className="w-full p-6 transition-all hover:shadow-md bg-gradient-to-l from-primary-50/50 to-transparent border-primary-100">
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary text-lg font-semibold">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1 text-right">
              <h3 className="text-lg font-semibold">{fullName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{user.email}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <EditUserDialog user={user} onSave={onEdit} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-primary-200 hover:bg-primary-100/50">
                  <UserCog className="h-4 w-4 text-primary-600" />
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
            <Button
              variant="destructive"
              size="icon"
              className="h-9 w-9 opacity-80 hover:opacity-100"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Section */}
        <div className="flex gap-3 items-center justify-end border-t border-primary-100 pt-4">
          <KycStatusLabel status={user.kyc_status} />
          <UserTypeLabel type={user.user_type} />
        </div>
      </div>
    </Card>
  );
}