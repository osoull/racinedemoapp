import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, MoreVertical, UserCog, UserPlus, UserX } from "lucide-react"
import { useState } from "react"
import { UserEditDialog } from "./UserEditDialog"
import { UserAddDialog } from "./UserAddDialog"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

interface UserListProps {
  users?: any[]
  isLoading: boolean
}

export function UserList({ users, isLoading }: UserListProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error

      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المستخدم",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsAdding(true)}>
          <UserPlus className="h-4 w-4 ml-2" />
          إضافة مستخدم
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium">
          <div className="col-span-2">المستخدم</div>
          <div>نوع المستخدم</div>
          <div>حالة KYC</div>
          <div>تاريخ التسجيل</div>
          <div className="text-left">إجراءات</div>
        </div>
        <div className="divide-y">
          {users?.map((user) => (
            <div key={user.id} className="grid grid-cols-6 gap-4 p-4 items-center">
              <div className="col-span-2 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
              <div>
                <Badge variant="outline">
                  {user.user_type === "basic_investor" && "مستثمر أساسي"}
                  {user.user_type === "qualified_investor" && "مستثمر مؤهل"}
                  {user.user_type === "borrower" && "طالب تمويل"}
                  {user.user_type === "investment_manager" && "مدير استثمار"}
                  {user.user_type === "admin" && "مشرف"}
                </Badge>
              </div>
              <div>
                <Badge 
                  variant={user.kyc_status === "approved" ? "default" : "secondary"}
                >
                  {user.kyc_status === "approved" ? "معتمد" : "قيد المراجعة"}
                </Badge>
              </div>
              <div>
                {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ar })}
              </div>
              <div className="text-left">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUser(user)
                        setIsEditing(true)
                      }}
                    >
                      <UserCog className="ml-2 h-4 w-4" />
                      تعديل المستخدم
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <UserX className="ml-2 h-4 w-4" />
                      حذف المستخدم
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      <UserEditDialog
        user={selectedUser}
        open={isEditing}
        onOpenChange={setIsEditing}
      />

      <UserAddDialog 
        open={isAdding}
        onOpenChange={setIsAdding}
      />
    </div>
  )
}