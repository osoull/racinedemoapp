import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { countries } from "@/utils/countries"
import { Profile } from "@/types/user"

interface AddressFieldsProps {
  profile: Partial<Profile>;
  setProfile: (profile: Partial<Profile>) => void;
}

export function AddressFields({ profile, setProfile }: AddressFieldsProps) {
  const handleChange = (field: keyof Profile, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">
          رقم المبنى <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.street_number || ''}
          onChange={(e) => handleChange('street_number', e.target.value)}
          placeholder="أدخل رقم المبنى"
          required
          className="bg-background/50 border-muted-foreground/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">
          اسم الشارع <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.street_name || ''}
          onChange={(e) => handleChange('street_name', e.target.value)}
          placeholder="أدخل اسم الشارع"
          required
          className="bg-background/50 border-muted-foreground/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">
          الرمز البريدي <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.postal_code || ''}
          onChange={(e) => handleChange('postal_code', e.target.value)}
          placeholder="أدخل الرمز البريدي"
          required
          className="bg-background/50 border-muted-foreground/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">
          المدينة <span className="text-red-500">*</span>
        </label>
        <Input
          value={profile.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="أدخل المدينة"
          required
          className="bg-background/50 border-muted-foreground/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">
          البلد <span className="text-red-500">*</span>
        </label>
        <Select 
          value={profile.country || undefined}
          onValueChange={(value) => handleChange('country', value)}
        >
          <SelectTrigger className="bg-background/50 border-muted-foreground/20 focus:border-primary">
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