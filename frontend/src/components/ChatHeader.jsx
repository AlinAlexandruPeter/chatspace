import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { X } from 'lucide-react'

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore()
    const { onlineUsers } = useAuthStore()
  return (
    <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="avatar relative">
                    <div className="size-10 rounded-full">
                        <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.name} />
                        {onlineUsers.includes(selectedUser._id) && (
                            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full" />
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="font-medium">{selectedUser.name}</h3>
                    <p className="text-sm text-base-content/70">
                        {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"} 
                    </p>
                </div>

            </div>
            <button onClick={() => setSelectedUser(null)}>
                <X />
            </button>
        </div>
    </div>
  )
}

export default ChatHeader