import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  title: string;
  description: string;
  progress: number;
  status: string;
  fundingGoal: number;
  currentFunding: number;
}

export function ProjectCard({ 
  title, 
  description, 
  progress, 
  status, 
  fundingGoal,
  currentFunding 
}: ProjectCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        <Badge variant={
          status === 'approved' ? 'default' :
          status === 'pending' ? 'secondary' :
          'destructive'
        }>
          {status}
        </Badge>
      </div>
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">التمويل الحالي: {currentFunding} ريال</span>
          <span className="font-medium">الهدف: {fundingGoal} ريال</span>
        </div>
      </div>
    </Card>
  );
}