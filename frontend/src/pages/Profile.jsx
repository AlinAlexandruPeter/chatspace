import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User } from 'lucide-react'

const Profile = () => {

  const { isUpdatingProfile, updateProfile, authUser } = useAuthStore()
  const [selectedImage, setSelectedImage] = useState(null)
  const handleImageUplaod = async (e) => {
    const file = e.target.files[0]
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image)
      await updateProfile({ profilePic: base64Image })
    }
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile info</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser.profilePic || "/avatar.png"}
                alt={authUser.name}
                className='size-32 rounded-full object-cover border-4'
              />
              <label
                htmlFor="avatar-upload"
                className={
                  `absolute bottom-0 right-0
                  bg-base-content hover-scale-105
                  p-2 rounded-full cursor-pointer
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className='size-5 text-base-200' />
                <input
                  type="file"
                  id='avatar-upload'
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUplaod}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm =">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your profile picture"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm flex items-center gap-2">
                <User className='size-4' />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.name}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm flex items-center gap-2">
                <Mail className='size-4' />
                Email
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p6">
            <div className="text-lg font-medium mb-4">Account Information</div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 borderb-b border-zinc-700">
                <span>Member Since</span>
                <span>{new Date(authUser?.createdAt?.split("T")[0]).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-600 bg-green-100 p-0.5 px-2 rounded">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile