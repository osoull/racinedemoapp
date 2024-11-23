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
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-all hover:bg-primary/5",
        "group relative",
        isActive && "bg-primary/10 text-primary font-medium"
      )}
    >
      <Icon className={cn(
        "h-5 w-5",
        isActive ? "text-primary" : "text-gray-500 group-hover:text-primary"
      )} />
      <div className="flex-1">
        <p className="text-sm leading-none mb-1">{title}</p>
        <p className={cn(
          "text-xs text-gray-500",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        )}>
          {description}
        </p>
      </div>
      {isActive && (
        <div className="absolute right-0 top-0 h-full w-1 bg-primary rounded-l-lg" />
      )}
    </Link>
  )
}