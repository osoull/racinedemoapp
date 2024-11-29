import { BackButton } from "@/components/BackButton"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileStatus } from "@/components/profile/ProfileStatus"
import { ProfileForm } from "@/components/profile/ProfileForm"

export default function Profile() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <BackButton />
      </div>
      <ProfileHeader />
      <ProfileStatus />
      <ProfileForm />
    </div>
  )
}