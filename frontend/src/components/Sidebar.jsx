import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton'
import { Users } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const Sidebar = () => {
    const {
        getUsers,
        users,
        selectedUser,
        setSelectedUSer,
        isUsersLoading,
    } = useChatStore()

    const  { onlineUsers } = useAuthStore()
    const [showOnlineOnly, sestShowOnlineOnly] = useState(false)

    useEffect(() => {
        getUsers()
    }, [getUsers])

    const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users

    if (isUsersLoading) return <SidebarSkeleton />
    return (
        <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
            <div className="border-bottom border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className='"size-6' />
                    <span className="font-medium-hidden lg:block">Contacts</span>
                </div>
                <div className="mt-3 hidden lg:flex items-center justify-between gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => sestShowOnlineOnly(e.target.checked)}
                            className='checkbox checkbox-sm'
                        />
                        <span className="text-sm">Show Online Only</span>
                    </label>
                    <span className="text-xs opacity-60">{onlineUsers.length - 1} online</span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        className={`
                            w-full p-3 gap-3 flex items-center
                            hover-:bg-base-300 transition-colors
                            ${selectedUser?._id === user._id && "bg-base-300 ring-1 ring-base-300"}
                        `}
                        onClick={() => setSelectedUSer(user)}
                    >
                        <div className="realtive mx-auto lg:mx-0 relative">
                            <img
                                src={user.profilePic || "avatar.png"}
                                alt={user?.name}
                                className='size-12 object-cover rounded-full'
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full" />
                            )}
                        </div>

                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.name}</div>
                            <div className="text-sm">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="p-3 text-center text-sm text-base-content/70">
                        No online users
                    </div>
                )}
            </div>
        </aside>
    )
}

export default Sidebar