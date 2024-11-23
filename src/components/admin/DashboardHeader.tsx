import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserAvatar } from "@/components/UserAvatar"
import { AdminSidebar } from "./AdminSidebar"

interface DashboardHeaderProps {
  breadcrumb: string
}

export const DashboardHeader = ({ breadcrumb }: DashboardHeaderProps) => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white border-b">
      <div className="flex h-16 items-center px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center gap-4">
          <span className="font-medium text-gray-900">{breadcrumb}</span>
          <form className="flex-1 mr-4 ml-4 lg:ml-6">
            <div className="relative">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="البحث..."
                className="w-full max-w-[300px] pr-8"
                type="search"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white">
              3
            </span>
          </Button>
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}