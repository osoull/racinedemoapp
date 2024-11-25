import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { Profile } from "@/types/user"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function ProfileStatus() {
  const { user } = useAuth()

  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardContent className="py-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <StatusBadge
            label="حالة الحساب"
            value={profile?.profile_completed ? "مكتمل" : "غير مكتمل"}
            color={profile?.profile_completed ? "success" : "warning"}
          />
          <StatusBadge
            label="نوع المستخدم"
            value={getUserType(profile?.user_type)}
            color="default"
          />
          <StatusBadge
            label="حالة التحقق"
            value={getKycStatus(profile?.kyc_status)}
            color={getKycStatusColor(profile?.kyc_status)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses = {
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    default: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100",
  }

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <Badge className={`${colorClasses[color as keyof typeof colorClasses]} font-medium px-3 py-1`}>
        {value}
      </Badge>
    </div>
  )
}

function getUserType(type?: string) {
  switch (type) {
    case 'admin':
      return 'مدير النظام'
    case 'borrower':
      return 'مقترض'
    case 'investment_manager':
      return 'مدير استثمار'
    case 'basic_investor':
      return 'مستثمر أساسي'
    case 'qualified_investor':
      return 'مستثمر مؤهل'
    default:
      return 'مستخدم'
  }
}

function getKycStatus(status?: string) {
  switch (status) {
    case 'approved':
      return 'معتمد'
    case 'rejected':
      return 'مرفوض'
    case 'pending':
      return 'قيد المراجعة'
    default:
      return 'غير مكتمل'
  }
}

function getKycStatusColor(status?: string) {
  switch (status) {
    case 'approved':
      return 'success'
    case 'rejected':
      return 'error'
    case 'pending':
      return 'warning'
    default:
      return 'default'
  }
}