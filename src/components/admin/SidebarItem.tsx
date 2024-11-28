import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

interface SidebarItemProps {
  icon: LucideIcon
  title: string
  description?: string
  path: string
  isActive?: boolean
}

export function SidebarItem({
  icon: Icon,
  title,
  description,
  path,
  isActive
}: SidebarItemProps) {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-4 rounded-lg border p-3 text-right transition-colors hover:bg-muted/50",
        isActive && "bg-muted"
      )}
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1">
        <p className="font-medium leading-none">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Link>
  )
}