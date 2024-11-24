import { useLocation } from "react-router-dom"
import { LogOut, Menu } from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { menuItems } from "./menu/MenuItems"

const SidebarContent = () => {
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
        {menuItems.map(renderMenuItem)}
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

export const AdminSidebar = () => {
  return (
    <>
      <div className="fixed top-0 right-0 bottom-0 w-72 border-l bg-white shadow-sm hidden lg:block">
        <SidebarContent />
      </div>

      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-full w-72 fixed right-0 top-0 rounded-none">
            <SidebarContent />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}