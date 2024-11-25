import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { countries } from "@/utils/countries"

interface AddressFieldsProps {
  profile: any
  setProfile: (profile: any) => void
}

export function AddressFields({ profile, setProfile }: AddressFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          رقم المبنى <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.street_number || ''}
          onChange={(e) => setProfile({ ...profile, street_number: e.target.value })}
          placeholder="أدخل رقم المبنى"
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
        <Select 
          value={profile.country || ''} 
          onValueChange={(value) => setProfile({ ...profile, country: value })}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر البلد" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}