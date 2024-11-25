interface ProjectStatusProps {
  status: string | null;
}

export const ProjectStatus = ({ status }: ProjectStatusProps) => {
  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusDisplay = (status: string | null) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'نشط';
      case 'pending':
        return 'قيد المراجعة';
      case 'rejected':
        return 'مرفوض';
      case 'completed':
        return 'مكتمل';
      default:
        return status;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusBadgeVariant(status)}-100 text-${getStatusBadgeVariant(status)}-800`}>
      {getStatusDisplay(status)}
    </span>
  );
};