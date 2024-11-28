import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface SubItem {
  title: string
  path: string
  description: string
  icon?: LucideIcon
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
      <div className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between",
            isActive && "bg-accent text-accent-foreground"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <Icon className="h-5 w-5 ml-2 shrink-0" />
            <div className="text-right">
              <p className="font-medium leading-none">{title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {description}
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </Button>
        {isOpen && (
          <div className="pr-6 pt-1">
            {subItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  "hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.path && "bg-accent text-accent-foreground"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                <div className="flex-1">
                  <p className="font-medium leading-none">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {item.description}
                  </p>
                </div>
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