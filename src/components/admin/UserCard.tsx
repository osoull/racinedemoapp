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
    <Card className="w-full p-4 transition-all hover:shadow-md bg-gradient-to-l from-primary-50/50 to-transparent border-primary-100">
      <div className="flex flex-col gap-3">
        {/* Header Section */}
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-3 flex-grow">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary text-base font-semibold shrink-0">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-0.5 text-right min-w-0 flex-grow">
              <h3 className="text-base font-semibold truncate">{fullName}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 shrink-0 mr-2">
            <EditUserDialog user={user} onSave={onEdit} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 border-primary-200 hover:bg-primary-100/50">
                  <UserCog className="h-4 w-4 text-primary-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
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
              className="h-8 w-8 opacity-80 hover:opacity-100"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Section */}
        <div className="flex gap-2 items-center justify-end border-t border-primary-100 pt-3">
          <KycStatusLabel status={user.kyc_status} />
          <UserTypeLabel type={user.user_type} />
        </div>
      </div>
    </Card>
  );
}