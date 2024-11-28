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
      {/* Header - Fixed at top */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
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
            
            {/* Logo - Light mode */}
            <img 
              src="/logo.svg"
              alt="شركة رسين للاستثمار"
              className="h-8 w-auto object-contain dark:hidden" 
            />
            {/* Logo - Dark mode */}
            <img 
              src="/logoblnc.svg"
              alt="شركة رسين للاستثمار"
              className="h-8 w-auto object-contain hidden dark:block" 
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main content area - Adjusted for fixed header */}
      <div className="flex pt-16 min-h-screen">
        {/* Desktop Sidebar - Fixed */}
        <aside className="fixed right-0 top-16 hidden lg:block h-[calc(100vh-4rem)] w-72 border-l bg-background overflow-y-auto">
          {sidebar}
        </aside>

        {/* Main Content - Adjusted margin for sidebar */}
        <main className={cn(
          "flex-1 lg:mr-72",
          className
        )}>
          <div className="container py-6 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}