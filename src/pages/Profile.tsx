import { BackButton } from "@/components/BackButton"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileStatus } from "@/components/profile/ProfileStatus"
import { ProfileForm } from "@/components/profile/ProfileForm"

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 pb-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="py-8">
          <BackButton />
        </div>
        
        <div className="space-y-8 animate-fade-in">
          <ProfileHeader />
          <ProfileStatus />
          <ProfileForm />
        </div>
      </div>
    </div>
  )
}