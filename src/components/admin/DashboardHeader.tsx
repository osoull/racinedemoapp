import { UserAvatar } from "@/components/UserAvatar"

interface DashboardHeaderProps {
  breadcrumb: string
}

export const DashboardHeader = ({ breadcrumb }: DashboardHeaderProps) => {
  return (
    <header className="fixed top-0 right-72 left-0 z-50 bg-white border-b">
      <div className="flex h-16 items-center px-6">
        <div className="flex flex-1 items-center">
          <span className="font-medium text-gray-900">{breadcrumb}</span>
        </div>
        <UserAvatar />
      </div>
    </header>
  )
}