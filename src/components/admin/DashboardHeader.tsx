import { UserAvatar } from "@/components/UserAvatar"

interface DashboardHeaderProps {
  breadcrumb: string
}

export const DashboardHeader = ({ breadcrumb }: DashboardHeaderProps) => {
  return (
    <header className="fixed top-0 right-72 left-0 z-50 bg-white border-b">
      <div className="flex h-16 items-center px-6">
        <UserAvatar />
      </div>
    </header>
  )
}