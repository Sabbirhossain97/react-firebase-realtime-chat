import { UserRound, Send } from 'lucide-react'
import { useState, useEffect } from 'react';
import { ref, push, set, onValue } from "firebase/database";
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

function Message() {
    const { chatRoomId, selectedUser } = useChat();
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const { user: currentUser } = useAuth();

    const sendMessage = async () => {
        if (!message.trim() || !chatRoomId) return;

        const messagesRef = ref(db, `messages/${chatRoomId}`);

        const newMsgRef = push(messagesRef);
        await set(newMsgRef, {
            userId: currentUser.uid,
            username: currentUser.email,
            message,
            timestamp: Date.now()
        })

        setMessage("")
    }

    useEffect(() => {
        if (!chatRoomId) return;
        const messagesRef = ref(db, `messages/${chatRoomId}`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data)
            if (data) {
                const allMessages = Object.entries(data).map(([id, msg]) => ({
                    id,
                    ...msg,
                }));
                setMessageList(allMessages);
            } else {
                setMessageList([]);
            }
        })

        return () => unsubscribe()

    }, [chatRoomId])

    console.log(chatRoomId)


    return (
        <div className="w-3/4 flex flex-col mx-auto">
            <div className="flex flex-row justify-between px-2 border-b border-gray-700 py-4">
                <div className="flex items-center w-full sm:w-1/2">
                    <div>
                        <UserRound className='rounded-full p-2 border border-white/10 h-10 w-10 text-lg' />
                    </div>
                    <div className="ml-3 flex items-center sm:items-start">
                        <p className="font-heebo text-[18px] not-italic font-bold leading-6">
                            {selectedUser?.email}
                        </p>
                        <p className="hidden sm:flex mt-1 whitespace-nowrap opacity-40 items-center text-[#181C2F] font-heebo text-[14px] not-italic font-medium leading-5">
                            Offline
                            &nbsp; Last seen 3 hours ago
                        </p>
                    </div>
                </div>
            </div>
            {/* chat area */}
            <div className="relative flex flex-col justify-between flex-1 space-y-4 mt-10 px-6">
                <div className='max-h-[600px] space-y-4 overflow-x-hidden overflow-y-auto'>
                    {messageList.map((msg) => {
                        const isSentByCurrentUser = msg.userId === currentUser?.uid; 

                        return (
                            <div
                                key={msg.id}
                                className={`flex w-full gap-2 ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                                {!isSentByCurrentUser && (
                                    <UserRound className='rounded-full p-2 border border-white/10 h-10 w-10 text-lg' />
                                )}

                                <p
                                    className={`py-3 px-4 rounded-xl max-w-[70%] ${isSentByCurrentUser
                                            ? "bg-blue-600 text-white text-right"
                                            : "bg-slate-800 text-white text-left"
                                        }`}
                                >
                                   {msg.message}
                                </p>

                                {isSentByCurrentUser && (
                                    <UserRound className='rounded-full p-2 border border-white/10 h-10 w-10 text-lg' />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* submit message area */}
                <div className="pb-4 w-full">
                    <div className='relative'>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border focus:border-blue-500 resize-none py-6 px-6 rounded-2xl bg-slate-800/80 bg-opacity-40 placeholder:text-[#A6ACBE] placeholder:font-lato placeholder:text-[16px] placeholder:not-italic placeholder:font-normal placeholder:leading-5"
                            placeholder="Type your message here…"
                        />
                        <div className="border border-black flex gap-4 absolute right-2 bottom-2 items-center">
                            <button onClick={sendMessage} className="flex cursor-pointer space-x-6 items-center absolute bottom-4 right-4">
                                <Send className='hover:text-blue-500' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message