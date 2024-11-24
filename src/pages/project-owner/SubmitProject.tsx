import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectSubmissionForm } from "@/components/project-owner/ProjectSubmissionForm";

const SubmitProject = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>تقديم مشروع جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectSubmissionForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitProject;