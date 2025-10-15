import { UserRound, Send } from 'lucide-react'
import { useState,useEffect } from 'react';
import { ref, push, set, onValue } from "firebase/database";
import { db } from '../firebase/config';
import useProfile from '../hooks/useProfile';

function Message() {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const { user } = useProfile();

    const sendMessage = async () => {
        if (!message.trim()) return;
        if (!user) return;
        const messagesRef = ref(db, 'messages');

        const newMsgRef = push(messagesRef);
        await set(newMsgRef, {
            userId: user.uid,
            username: user.email,
            message,
            timestamp: Date.now()
        })

        setMessage("")
    }

    useEffect(() => {
        const messagesRef = ref(db, 'messages');
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const msgs = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
                setMessageList(msgs);

            } else {
                setMessageList([])
            }
        })

        return () => unsubscribe()

    }, [])

    return (
        <div className="w-3/4 flex flex-col mx-auto">
            <div className="flex flex-row justify-between px-2 border-b border-gray-700 py-4">
                <div className="flex items-center w-full sm:w-1/2">
                    <div>
                        <UserRound className='rounded-full p-2 border border-white/10 h-10 w-10 text-lg' />
                    </div>
                    <div className="ml-3 flex items-center sm:items-start">
                        <p className="font-heebo text-[18px] not-italic font-bold leading-6">
                            Fred Williams
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
                    {messageList.map((msg, index) => {
                        if (index % 2 === 0) {
                            return (
                                <div
                                    key={index}
                                    className={`flex w-full gap-2 ${index % 2 === 0 ? "justify-start" : "justify-end"
                                        }`}
                                >
                                    <UserRound className='rounded-full p-2 border border-white/10 h-10 w-10 text-lg' />
                                    <p
                                        className={`py-3 px-4 rounded-xl max-w-[70%] ${index % 2 === 0
                                            ? "bg-slate-800/80 text-left"
                                            : "bg-slate-700/80 text-right"
                                            }`}
                                    >
                                        {msg.message}
                                    </p>
                                </div>
                            )
                        } else {
                            return (
                                <div
                                    key={index}
                                    className={`flex w-full gap-2 ${index % 2 === 0 ? "justify-start" : "justify-end"
                                        }`}
                                >
                                    <p
                                        className={`py-3 px-4 rounded-xl max-w-[70%] ${index % 2 === 0
                                            ? "bg-slate-800/80 text-left"
                                            : "bg-slate-700/80 text-right"
                                            }`}
                                    >
                                        {msg.message}
                                    </p>
                                    <UserRound className='rounded-full p-2 border border-white/10 h-10 w-10 text-lg' />
                                </div>
                            )
                        }
                    })}
                </div>
                {/* submit message area */}
                <div className="pb-4 w-full">
                    <div className='relative'>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full resize-none py-6 px-6 rounded-2xl bg-slate-800/80 bg-opacity-40 placeholder:text-[#A6ACBE] placeholder:font-lato placeholder:text-[16px] placeholder:not-italic placeholder:font-normal placeholder:leading-5"
                            placeholder="Type your message here…"
                        />
                        <div className="border border-black flex gap-4 absolute right-2 bottom-2 items-center">
                            <button onClick={sendMessage} className="flex space-x-6 items-center absolute bottom-4 right-4">
                                <Send />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message