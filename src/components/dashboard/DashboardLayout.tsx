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
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-6 md:gap-10">
            <h2 className="text-2xl font-bold tracking-tight">لوحة التحكم</h2>
          </div>
          <UserNav />
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Sidebar */}
        <aside className="fixed top-20 z-30 -mr-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 overflow-y-auto border-l md:sticky md:block">
          <DashboardNav />
        </aside>

        {/* Main Content */}
        <main className={cn("flex w-full flex-col overflow-hidden", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}