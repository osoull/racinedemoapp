import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

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

export const SidebarItem = ({ title, icon: Icon, path, description, isActive, subItems }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (subItems) {
    return (
      <div className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between",
            "group relative hover:bg-primary/5 dark:hover:bg-primary/10",
            isActive && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <Icon className={cn(
              "h-5 w-5",
              isActive 
                ? "text-primary dark:text-white" 
                : "text-muted-foreground group-hover:text-primary dark:text-white/70 dark:group-hover:text-white"
            )} />
            <div className="flex-1 text-right">
              <p className="text-sm leading-none mb-1">{title}</p>
              <p className={cn(
                "text-xs text-muted-foreground dark:text-white/70",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              )}>
                {description}
              </p>
            </div>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} />
        </Button>
        
        {isOpen && (
          <div className="pr-4 space-y-1">
            {subItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  "group relative hover:bg-primary/5 dark:hover:bg-primary/10",
                  isActive && item.path === path && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4",
                  isActive && item.path === path
                    ? "text-primary dark:text-white" 
                    : "text-muted-foreground group-hover:text-primary dark:text-white/70 dark:group-hover:text-white"
                )} />
                <span className="text-sm">{item.title}</span>
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