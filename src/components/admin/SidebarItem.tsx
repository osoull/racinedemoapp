import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SidebarItemProps {
  title: string
  icon: LucideIcon
  path: string
  description: string
  isActive: boolean
}

export const SidebarItem = ({ title, icon: Icon, path, description, isActive }: SidebarItemProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
        "group relative",
        isActive && "bg-gray-100/80 text-gray-900"
      )}
    >
      <div className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
        isActive ? "bg-primary/10 text-primary" : "group-hover:bg-gray-100"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 text-right">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className={cn(
          "text-xs text-gray-500 mt-0.5 transition-all duration-200",
          "opacity-0 group-hover:opacity-100"
        )}>
          {description}
        </p>
      </div>
      {isActive && (
        <div className="absolute right-0 h-full w-1 bg-primary rounded-l-lg" />
      )}
    </Link>
  )
}