import { Input } from "@/components/ui/input"

interface AddressFieldsProps {
  profile: any
  setProfile: (profile: any) => void
}

export function AddressFields({ profile, setProfile }: AddressFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          رقم الشارع <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.street_number || ''}
          onChange={(e) => setProfile({ ...profile, street_number: e.target.value })}
          placeholder="أدخل رقم الشارع"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          اسم الشارع <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.street_name || ''}
          onChange={(e) => setProfile({ ...profile, street_name: e.target.value })}
          placeholder="أدخل اسم الشارع"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          الرمز البريدي <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.postal_code || ''}
          onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
          placeholder="أدخل الرمز البريدي"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          المدينة <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.city || ''}
          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          placeholder="أدخل المدينة"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          البلد <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.country || ''}
          onChange={(e) => setProfile({ ...profile, country: e.target.value })}
          placeholder="أدخل البلد"
          required
        />
      </div>
    </div>
  )
}