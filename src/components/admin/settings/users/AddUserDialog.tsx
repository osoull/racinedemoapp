import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { AddUserForm } from "./AddUserForm"
import { UserPlus } from "lucide-react"

export function AddUserDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const onSuccess = () => {
    setOpen(false)
    toast({
      title: "تم إضافة المستخدم",
      description: "تم إضافة المستخدم بنجاح",
    })
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="ml-2 h-4 w-4" />
        إضافة مستخدم
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          </DialogHeader>
          <AddUserForm onSuccess={onSuccess} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}