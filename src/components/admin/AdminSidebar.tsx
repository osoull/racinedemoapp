import { useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { businessMenuItems } from "./menu/businessItems"

export const AdminSidebar = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full flex-col bg-white">
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {businessMenuItems.map((item) => (
          <SidebarItem
            key={item.path}
            {...item}
            isActive={location.pathname === item.path}
            subItems={item.subItems}
          />
        ))}
      </nav>
      <div className="border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut?.()}
        >
          <LogOut className="mr-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )
}