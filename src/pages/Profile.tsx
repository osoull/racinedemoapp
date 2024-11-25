import { BackButton } from "@/components/BackButton"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileStatus } from "@/components/profile/ProfileStatus"
import { ProfileForm } from "@/components/profile/ProfileForm"

export default function Profile() {
  return (
    <div className="min-h-screen bg-muted/10 pb-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="py-8">
          <BackButton />
        </div>
        
        <ProfileHeader />
        <ProfileStatus />
        <ProfileForm />
      </div>
    </div>
  )
}