import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContentManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المحتوى</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>محتوى الموقع</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add website content management tools */}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>اتصالات المستخدم</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add user communication tools */}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentManagement;