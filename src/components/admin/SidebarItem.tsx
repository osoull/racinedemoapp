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
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground font-medium"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex-1 truncate">
        <p className="font-medium leading-none">{title}</p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {description}
        </p>
      </div>
    </Link>
  )
}