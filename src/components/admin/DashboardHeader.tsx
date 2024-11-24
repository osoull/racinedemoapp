import { UserAvatar } from "@/components/UserAvatar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  breadcrumb: string
}

export const DashboardHeader = ({ breadcrumb }: DashboardHeaderProps) => {
  return (
    <header className="fixed top-0 right-72 left-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">مرحباً، مدير النظام</h1>
          <p className="text-sm text-muted-foreground">هذا ملخص لوحة القيادة</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}