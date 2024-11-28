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
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        "group relative hover:bg-primary/5 dark:hover:bg-primary/10",
        isActive && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium"
      )}
    >
      <Icon className={cn(
        "h-5 w-5",
        isActive 
          ? "text-primary dark:text-white" 
          : "text-muted-foreground group-hover:text-primary dark:text-white/70 dark:group-hover:text-white"
      )} />
      <div className="flex-1">
        <p className="text-sm leading-none mb-1">{title}</p>
        <p className={cn(
          "text-xs text-muted-foreground dark:text-white/70",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        )}>
          {description}
        </p>
      </div>
    </Link>
  )
}