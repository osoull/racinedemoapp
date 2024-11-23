import { ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"

export const BackButton = () => {
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      onClick={() => navigate(-1)}
      className="mb-4 flex items-center gap-2"
    >
      <ChevronRight className="h-4 w-4" />
      Précédent
    </Button>
  )
}