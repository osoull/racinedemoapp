import { useAuth } from "@/contexts/AuthContext"
import { UserNav } from "./UserNav"
import { cn } from "@/lib/utils"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import Footer from "@/components/Footer"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
  sidebar: React.ReactNode
}

export function DashboardLayout({ children, className, sidebar }: DashboardLayoutProps) {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Fixed */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          {/* Mobile menu button */}
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-72">
              {sidebar}
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center h-14">
            <img 
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg"
              alt="رسين"
              className="h-14 w-auto object-contain py-2 dark:hidden" 
            />
            <img 
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg"
              alt="رسين"
              className="h-14 w-auto object-contain py-2 hidden dark:block" 
            />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 mr-auto">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main layout with fixed sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - Fixed for desktop */}
        <aside className="fixed top-14 right-0 hidden lg:block w-64 h-[calc(100vh-3.5rem)] border-l bg-background overflow-y-auto">
          {sidebar}
        </aside>

        {/* Main content - With proper margin for sidebar */}
        <main className={cn(
          "flex-1 lg:mr-64 min-h-[calc(100vh-3.5rem-2.5rem)]",
          className
        )}>
          <div className="container max-w-screen-2xl p-6 space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer - With proper margin for sidebar */}
      <div className="lg:mr-64 mt-auto">
        <Footer />
      </div>
    </div>
  )
}