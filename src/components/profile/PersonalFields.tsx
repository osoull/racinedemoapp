import { Input } from "@/components/ui/input"
import { Profile } from "@/types/user"

interface PersonalFieldsProps {
  profile: Partial<Profile>;
  setProfile: (profile: Partial<Profile>) => void;
}

export function PersonalFields({ profile, setProfile }: PersonalFieldsProps) {
  const handleChange = (field: keyof Profile, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">
          الاسم الأول <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.first_name || ''}
          onChange={(e) => handleChange('first_name', e.target.value)}
          placeholder="أدخل اسمك الأول"
          required
          className="bg-background/50 border-muted-foreground/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">
          الاسم الأوسط
        </label>
        <Input
          value={profile.middle_name || ''}
          onChange={(e) => handleChange('middle_name', e.target.value)}
          placeholder="أدخل اسمك الأوسط (اختياري)"
          className="bg-background/50 border-muted-foreground/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">
          اسم العائلة <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.last_name || ''}
          onChange={(e) => handleChange('last_name', e.target.value)}
          placeholder="أدخل اسم عائلتك"
          required
          className="bg-background/50 border-muted-foreground/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">
          رقم الهاتف <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="أدخل رقم هاتفك"
          dir="ltr"
          required
          className="bg-background/50 border-muted-foreground/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">
          رقم الهوية <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.national_id || ''}
          onChange={(e) => handleChange('national_id', e.target.value)}
          placeholder="أدخل رقم هويتك"
          dir="ltr"
          required
          className="bg-background/50 border-muted-foreground/20 focus:border-primary"
        />
      </div>
    </div>
  )
}