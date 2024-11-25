import { Input } from "@/components/ui/input"

interface PersonalFieldsProps {
  profile: any
  setProfile: (profile: any) => void
}

export function PersonalFields({ profile, setProfile }: PersonalFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          الاسم الأول <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.first_name || ''}
          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
          placeholder="أدخل اسمك الأول"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          اسم العائلة <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.last_name || ''}
          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
          placeholder="أدخل اسم عائلتك"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          رقم الهاتف <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.phone || ''}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          placeholder="أدخل رقم هاتفك"
          dir="ltr"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          رقم الهوية <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.national_id || ''}
          onChange={(e) => setProfile({ ...profile, national_id: e.target.value })}
          placeholder="أدخل رقم هويتك"
          dir="ltr"
          required
        />
      </div>
    </div>
  )
}