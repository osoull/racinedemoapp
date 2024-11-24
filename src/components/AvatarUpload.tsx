import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function AvatarUpload() {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id}.${fileExt}`;

      // Upload image to Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update user profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      toast({
        title: "تم التحديث",
        description: "تم تحديث صورة الملف الشخصي بنجاح",
      });

    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تحديث الصورة",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user?.user_metadata?.avatar_url} />
        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <Button variant="outline" className="relative">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
          ) : (
            <Upload className="h-4 w-4 ml-2" />
          )}
          تحميل صورة جديدة
        </Button>
      </div>
    </div>
  );
}