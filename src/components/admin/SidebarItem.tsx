import { useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LucideIcon, ChevronDown } from "lucide-react"

interface SubItem {
  title: string
  path: string
  icon: LucideIcon
  description?: string
}

interface SidebarItemProps {
  title: string
  icon: LucideIcon
  path: string
  description: string
  isActive: boolean
  subItems?: SubItem[]
}

export const SidebarItem = ({ 
  title, 
  icon: Icon, 
  path, 
  description, 
  isActive,
  subItems 
}: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (subItems) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
            "group relative hover:bg-primary/5",
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
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "transform rotate-180"
          )} />
        </button>
        {isOpen && (
          <div className="mr-4 mt-1 space-y-1 border-r pr-4">
            {subItems.map((subItem) => (
              <Link
                key={subItem.path}
                to={subItem.path}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                  "hover:bg-primary/5",
                  location.pathname === subItem.path && "bg-primary/10 text-primary font-medium"
                )}
              >
                <subItem.icon className="h-4 w-4" />
                {subItem.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
        "group relative hover:bg-primary/5",
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
    </Link>
  )
}