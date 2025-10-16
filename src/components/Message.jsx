import { UserRound, Send, CheckCheck, Menu } from 'lucide-react'
import { useRef, useState, useEffect } from 'react';
import { ref, push, set, onValue } from "firebase/database";
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import EmptyChatRoom from './EmptyChatRoom';
import { timeAgo } from '../helpers/relativeTime';

function Message({ setChatSideBar }) {
    const { chatRoomId, selectedUser } = useChat();
    const messagesContainerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [userRealtime, setUserRealtime] = useState(selectedUser);
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        if (!selectedUser) return;

        const userRef = ref(db, `users/${selectedUser.uid}`);
        const unsubscribe = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUserRealtime({ uid: selectedUser.uid, ...data });
            }
        });

        return () => unsubscribe();
    }, [selectedUser]);

    function messageTime(timestamp) {
        const date = new Date(timestamp);

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const timeString = `${hours}:${minutes}`;
        return timeString
    }

    const sendMessage = async () => {
        if (!message.trim() || !chatRoomId) return;

        const messagesRef = ref(db, `messages/${chatRoomId}`);

        const newMsgRef = push(messagesRef);
        await set(newMsgRef, {
            userId: currentUser.uid,
            username: currentUser.email,
            message,
            timestamp: Date.now(),
            readBy: {
                [currentUser.uid]: true,
                [selectedUser.uid]: false
            }
        })

        setMessage("")
    }

    useEffect(() => {
        if (!chatRoomId) return;
        const messagesRef = ref(db, `messages/${chatRoomId}`);

        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allMessages = Object.entries(data).map(([id, msg]) => (
                    {
                        id,
                        ...msg,
                    }
                ));
                setMessageList(allMessages);
                allMessages.forEach((msg) => {
                    if (msg.userId !== currentUser.uid) {
                        const messageRef = ref(db, `messages/${chatRoomId}/${msg.id}/readBy/${currentUser.uid}`);
                        set(messageRef, true);
                    }
                })
            } else {
                setMessageList([]);
            }
        })

        return () => unsubscribe()

    }, [chatRoomId])

    useEffect(() => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    }, [messageList]);

    return (
        <div className="w-full lg:w-3/4 min-h-screen flex flex-col mx-auto">
            <div className={`${selectedUser ? 'py-4' : 'py-10'} flex flex-row justify-between px-2 lg:px-4 border-b border-gray-700`}>
                <div className='flex flex-row gap-3 lg:gap-6 items-center'>
                    <button className='lg:hidden' onClick={() => setChatSideBar(true)}>
                        <Menu className='ml-2 lg:ml-6' />
                    </button>
                    {selectedUser && <div className="flex justify-start items-start w-full sm:w-1/2">
                        <div>
                            <UserRound className='rounded-full p-2 border border-white/10 h-10 w-10 text-lg' />
                        </div>
                        <div className="ml-3 flex flex-col items-start justify-center">
                            <p className="font-heebo text-[18px] not-italic font-bold leading-6">
                                {userRealtime?.email}
                            </p>
                            <p className="mt-1 whitespace-nowrap font-heebo text-[14px] not-italic font-medium leading-5">
                                {userRealtime?.online ?
                                    <p className='text-green-500'>
                                        Online
                                    </p>
                                    :
                                    <p className='text-gray-400'> Last seen {timeAgo(userRealtime?.lastSeen)}</p>
                                }
                            </p>
                        </div>
                    </div>}
                </div>
            </div>
            {selectedUser ? <div className="relative bg-slate-900 flex flex-col justify-between flex-1 space-y-4 pt-6 px-4 lg:px-6">
                <div ref={messagesContainerRef} className='max-h-[680px] space-y-10 lg:space-y-4 overflow-x-hidden overflow-y-auto'>
                    {messageList.map((msg) => {
                        const isSentByCurrentUser = msg.userId === currentUser?.uid;
                        const isSeenByReceiver = msg.readBy[selectedUser.uid] === true ? true : false
                        return (
                            <div
                                key={msg.id}
                                className={`flex gap-2 ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                                {!isSentByCurrentUser && (
                                    <UserRound className="rounded-full p-2 border border-white/10 h-10 w-10 text-lg" />
                                )}

                                <div
                                    className={`flex flex-col gap-1 ${isSentByCurrentUser ? "items-end" : "items-start"
                                        }`}
                                    style={{ maxWidth: "75%" }}
                                >
                                    <div className="flex gap-2 items-center">
                                        <p>{msg.username}</p>
                                        <p className="text-sm text-gray-400">{messageTime(msg.timestamp)}</p>
                                    </div>

                                    <div className="flex items-end gap-2">
                                        <p
                                            className={`py-2 px-3 rounded-lg break-words whitespace-pre-wrap text-white ${isSentByCurrentUser
                                                ? "bg-slate-700 order-2"
                                                : "bg-slate-800 order-1"
                                                }`}
                                            style={{
                                                wordBreak: "break-word",
                                                maxWidth: "100%",
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {msg.message}
                                        </p>

                                        <p
                                            className={`order-1 ${isSentByCurrentUser ? "order-1" : "order-2"}`}
                                            title={`${isSeenByReceiver ? "Read" : "Delivered"}`}
                                        >
                                            <CheckCheck
                                                className={`${isSeenByReceiver ? "text-green-500" : ""} h-4 w-4`}
                                            />
                                        </p>
                                    </div>
                                </div>

                                {/* Right avatar for sender */}
                                {isSentByCurrentUser && (
                                    <UserRound className="rounded-full p-2 border border-white/10 h-10 w-10 text-lg" />
                                )}
                            </div>

                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div> : <EmptyChatRoom />}
            <div className="px-4 lg:px-6 w-full border-t border-gray-700 py-4">
                <div className='relative'>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        className="w-full pr-16 border border-gray-700 transition duration-300 outline-none focus:border-blue-500 resize-none py-4 px-6 rounded-2xl bg-slate-800/80 bg-opacity-40 placeholder:text-[#A6ACBE] placeholder:font-lato placeholder:text-[16px] placeholder:not-italic placeholder:font-normal placeholder:leading-5"
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
    )
}

export default Message