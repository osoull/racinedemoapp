import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Mail, Trash2, UserCog } from "lucide-react";

type User = {
  id: string;
  email: string;
  full_name: string | null;
  user_type: string | null;
  kyc_status: string | null;
};

type UserCardProps = {
  user: User;
  onDelete: (user: User) => void;
  onUpdateType: (userId: string, newType: string) => void;
};

export function UserCard({ user, onDelete, onUpdateType }: UserCardProps) {
  const getUserTypeColor = (type: string | null) => {
    switch (type) {
      case 'admin':
        return 'bg-red-500';
      case 'investment_manager':
        return 'bg-blue-500';
      case 'investor':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getKycStatusColor = (status: string | null) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-semibold">
              {user.full_name || 'Nom non défini'}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="mr-2 h-4 w-4" />
              {user.email}
            </div>
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <UserCog className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdateType(user.id, 'investor')}>
                  Définir comme Investisseur
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateType(user.id, 'investment_manager')}>
                  Définir comme Manager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateType(user.id, 'admin')}>
                  Définir comme Admin
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
          <Badge variant="secondary" className={getUserTypeColor(user.user_type)}>
            {user.user_type || 'Type non défini'}
          </Badge>
          <Badge variant="secondary" className={getKycStatusColor(user.kyc_status)}>
            KYC: {user.kyc_status || 'Non défini'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}