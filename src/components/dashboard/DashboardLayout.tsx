import { useAuth } from "@/contexts/AuthContext"
import { UserNav } from "./UserNav"
import { DashboardNav } from "./DashboardNav"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex gap-4">
            <h2 className="text-lg font-semibold tracking-tight">لوحة التحكم</h2>
          </div>
          <UserNav />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-l">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-4">
            <DashboardNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn("flex-1 px-6 py-6", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}