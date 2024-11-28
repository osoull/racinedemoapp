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
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
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
          <div className="flex items-center gap-2 mr-4">
            <img 
              src="/logo.svg"
              alt="رسين"
              className="h-8 w-auto object-contain dark:hidden" 
            />
            <img 
              src="/logoblnc.svg"
              alt="رسين"
              className="h-8 w-auto object-contain hidden dark:block" 
            />
          </div>

          {/* Right side actions */}
          <div className="mr-auto flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex min-h-screen pt-14">
        {/* Sidebar - Desktop */}
        <aside className="fixed right-0 top-14 hidden lg:block w-64 h-[calc(100vh-3.5rem)] border-l bg-background">
          {sidebar}
        </aside>

        {/* Main content */}
        <main className={cn(
          "flex-1 lg:mr-64",
          className
        )}>
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}