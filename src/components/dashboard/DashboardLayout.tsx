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
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-6 md:gap-10">
            <h2 className="text-2xl font-bold tracking-tight">لوحة التحكم</h2>
          </div>
          <UserNav />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-l md:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <DashboardNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn("flex-1 p-4 md:p-8", className)}>
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}