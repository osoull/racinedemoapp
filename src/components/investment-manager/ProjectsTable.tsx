import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ProjectsTableProps {
  projects: any[];
  onUpdateStatus: (projectId: string, status: string) => void;
  isLoading: boolean;
}

const ProjectsTable = ({ projects, onUpdateStatus, isLoading }: ProjectsTableProps) => {
  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>عنوان المشروع</TableHead>
          <TableHead>صاحب المشروع</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects?.map((project) => (
          <TableRow key={project.project_id}>
            <TableCell>{project.title}</TableCell>
            <TableCell>{project.owner?.full_name}</TableCell>
            <TableCell>{project.status}</TableCell>
            <TableCell>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(project.project_id, "approved")}
                  disabled={project.status === "approved"}
                >
                  موافقة
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(project.project_id, "rejected")}
                  disabled={project.status === "rejected"}
                >
                  رفض
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectsTable;