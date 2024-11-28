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
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg"
              alt="شركة رسين للاستثمار"
              className="h-16 w-auto py-2 object-contain dark:hidden" 
            />
            {/* Logo - Dark mode */}
            <img 
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg"
              alt="شركة رسين للاستثمار"
              className="h-16 w-auto py-2 object-contain hidden dark:block" 
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

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
        {/* Desktop Sidebar */}
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-l md:sticky md:block">
          {sidebar}
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-hidden px-4 py-6 md:px-6 lg:px-8",
          className
        )}>
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}