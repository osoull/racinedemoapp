import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserEditForm } from "./UserEditForm"

interface UserEditDialogProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserEditDialog({ user, open, onOpenChange }: UserEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>تعديل معلومات المستخدم</DialogTitle>
        </DialogHeader>
        <UserEditForm user={user} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}