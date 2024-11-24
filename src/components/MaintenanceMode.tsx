import { usePlatformSettingsContext } from "@/contexts/PlatformSettingsContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const MaintenanceMode = ({ children }: { children: React.ReactNode }) => {
  const { settings } = usePlatformSettingsContext();

  if (settings?.maintenance_mode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>الموقع تحت الصيانة</AlertTitle>
          <AlertDescription>
            عذراً، الموقع تحت الصيانة حالياً. يرجى المحاولة مرة أخرى لاحقاً.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};