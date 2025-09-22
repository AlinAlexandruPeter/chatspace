import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages
    } = useChatStore();
    const [scrollingType, setScrollingType] = useState("instant");
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        setScrollingType("instant");
        getMessages(selectedUser._id);
        
        subscribeToMessages();
        
        return () => unsubscribeFromMessages()
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);
    
    useEffect(() => {
        console.log(messages)
        
        if (messageEndRef.current && messages) {
            setScrollingType("smooth");
            messageEndRef.current.scrollIntoView({ behavior: scrollingType, block: "end" });
        }
    }, [messages]);

    if (isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
        </div>
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        const options = date.getFullYear() === now.getFullYear()
            ? { month: 'long', day: 'numeric' }
            : { month: 'long', day: 'numeric', year: 'numeric' };

        return date.toLocaleDateString('en-US', options);
    };

    let lastDate = null;

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.map((m, i) => {
                    const currentDate = m.createdAt.split('T')[0];
                    const shouldShowDate = currentDate !== lastDate;
                    if (shouldShowDate) lastDate = currentDate;

                    return (
                        <div key={m._id} ref={messageEndRef}>
                            {shouldShowDate && (
                                <p className='text-xs opacity-50 text-center mb-2'>
                                    {formatDate(m.createdAt)}
                                </p>
                            )}
                            <div className={`chat ${m.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                                <div className="chat-image avatar">
                                    <div className="size-10 rounded-full border">
                                        <img
                                            src={
                                                m.senderId === authUser._id
                                                    ? (authUser.profilePic || "/avatar.png")
                                                    : (selectedUser.profilePic || "/avatar.png")
                                            }
                                            alt=""
                                        />
                                    </div>
                                </div>
                                {m.senderId !== messages[i - 1]?.senderId && (
                                    <div className="chat-header mb-1">
                                        <time className='text-xs opacity-50 ml-1'>
                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </time>
                                    </div>
                                )}
                                <div className={`chat-bubble flex flex-col ${m.senderId !== authUser._id && "bg-base-content text-base-300"} font-semibold`}>
                                    {m.image && (
                                        <img
                                            src={m.image}
                                            alt=""
                                            className='sm:max-w-[200px] rounded-md mb-2'
                                        />
                                    )}
                                    {m.text && <p>{m.text}</p>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <MessageInput />
        </div>
    );
};

export default ChatContainer;
