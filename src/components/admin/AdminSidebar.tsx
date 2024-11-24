import { useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { businessMenuItems, platformSettingsItems } from "./menuItems"

export const AdminSidebar = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  const renderMenuItem = (item: any) => {
    const isActive = location.pathname === item.path
    
    return (
      <div key={item.path} className="space-y-1">
        <SidebarItem
          {...item}
          isActive={isActive}
        />
        {item.subItems && isActive && (
          <div className="mr-4 border-r pr-4 pt-2">
            {item.subItems.map((subItem: any) => (
              <SidebarItem
                key={subItem.path}
                {...subItem}
                isActive={location.pathname === subItem.path}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <img src="/logo.svg" alt="Racine Logo" className="h-8" />
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {/* Business Features */}
        <div className="mb-6">
          <h3 className="px-3 text-sm font-semibold text-gray-500 mb-2">
            الوظائف الأساسية
          </h3>
          {businessMenuItems.map(renderMenuItem)}
        </div>

        {/* Platform Settings */}
        <div>
          <h3 className="px-3 text-sm font-semibold text-gray-500 mb-2">
            إعدادات المنصة
          </h3>
          {platformSettingsItems.map(renderMenuItem)}
        </div>
      </nav>
      <div className="border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut?.()}
        >
          <LogOut className="ml-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )
}