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

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
  sidebar: React.ReactNode
}

export function DashboardLayout({ children, className, sidebar }: DashboardLayoutProps) {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          <div className="flex items-center mr-0 px-4">
            <img 
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg"
              alt="رسين"
              className="h-8 w-auto object-contain dark:hidden" 
            />
            <img 
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg"
              alt="رسين"
              className="h-8 w-auto object-contain hidden dark:block" 
            />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 mr-auto">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar - Desktop */}
        <aside className="fixed right-0 top-14 hidden lg:block w-64 h-[calc(100vh-3.5rem)] border-l bg-background overflow-y-auto">
          {sidebar}
        </aside>

        {/* Main content */}
        <main className={cn(
          "flex-1 lg:mr-64",
          className
        )}>
          <div className="container max-w-screen-2xl py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}