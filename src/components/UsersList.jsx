import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import { UserRound } from 'lucide-react'
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import EmptyUsersData from "./EmptyUsersData";
import Spinner from "./Spinner";

function UsersList() {
    const [userList, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { user: currentUser } = useAuth();
    const { selectUser } = useChat();
    const [msgFilter, setMsgFilter] = useState('all');
    const [loadingUsers, setLoadingUsers] = useState(false)

    useEffect(() => {
        if (!userList) return;

        switch (msgFilter) {
            case 'all':
                setFilteredUsers(userList);
                break;
            case 'read':
                setFilteredUsers(userList.filter(user => !user.hasNew));
                break;
            case 'unread':
                setFilteredUsers(userList.filter(user => user.hasNew));
                break;
            default:
                setFilteredUsers(userList);
        }
    }, [msgFilter, userList]);

    useEffect(() => {
        if (!currentUser) return;

        const usersRef = ref(db, "users");

        setLoadingUsers(true);
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setUserList([]);
                return;
            }

            const allUsers = Object.entries(data).map(([uid, info]) => ({
                uid,
                ...info,
            }));

            const filteredUsers = allUsers.filter(u => u.uid !== currentUser.uid);

            const usersWithNew = filteredUsers.map(u => {
                const roomId =
                    currentUser.uid < u.uid
                        ? `${currentUser.uid}_${u.uid}`
                        : `${u.uid}_${currentUser.uid}`;

                const messagesRef = ref(db, `messages/${roomId}`);

                let hasNew = false;

                onValue(messagesRef, (msgSnapshot) => {
                    const messagesData = msgSnapshot.val();
                    if (messagesData) {
                        hasNew = Object.values(messagesData).some(
                            (msg) =>
                                msg.userId !== currentUser.uid &&
                                (!msg.readBy || !msg.readBy[currentUser.uid])
                        );
                        setUserList((prev) =>
                            prev.map((user) =>
                                user.uid === u.uid ? { ...user, hasNew } : user
                            )
                        );
                    } else {
                        setUserList((prev) =>
                            prev.map((user) =>
                                user.uid === u.uid ? { ...user, hasNew: false } : user
                            )
                        );
                    }
                });
                setLoadingUsers(false)

                return { ...u, hasNew: false };
            });

            setUserList(usersWithNew);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return (
        <div >
            <div className="px-4 py-6 border-b border-gray-700">
                <h1 className="text-2xl font-bold">Chat</h1>
            </div>
            {userList.length > 0 && <div className="px-4 pt-4">
                <ul className="flex gap-2">
                    <li><button onClick={() => setMsgFilter('all')} className={`${msgFilter === 'all' ? 'bg-slate-700' : 'bg-slate-800'} cursor-pointer hover:bg-slate-700 transition duration-300 px-4 rounded-lg py-1`}>All</button></li>
                    <li><button onClick={() => setMsgFilter('read')} className={`${msgFilter === 'read' ? 'bg-slate-700' : 'bg-slate-800'} cursor-pointer hover:bg-slate-700 transition duration-300 px-4 rounded-lg py-1`}>Read</button></li>
                    <li><button onClick={() => setMsgFilter('unread')} className={`${msgFilter === 'unread' ? 'bg-slate-700' : 'bg-slate-800'} cursor-pointer hover:bg-slate-700 transition duration-300 px-4 rounded-lg py-1`}>Unread</button></li>
                </ul>
            </div>}
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {
                    loadingUsers ? (
                        <div className="text-center flex justify-center text-gray-400" > <Spinner /></div>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                            <div
                                key={u.uid}
                                className="w-full relative px-2 py-5 bg-slate-800/80 hover:bg-slate-700/50 cursor-pointer rounded-md transition duration-300"
                                onClick={() => selectUser(u, currentUser.uid)}
                            >
                                <div className="text-sm absolute bg-blue-500 right-0 -top-1 rounded-lg px-2">
                                    {u.hasNew ? "new" : ""}
                                </div>
                                <div className="flex mt-1 justify-between px-2">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div>
                                            <UserRound className='rounded-full p-2 border border-white/10 h-10 w-10 text-lg' />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[16px] font-semibold truncate">{u.email}</p>
                                            <div className="flex justify-between">
                                                <p className={`text-sm ${u.online ? "text-green-400" : "text-gray-400"}`}>
                                                    {u.online ? "Online" : "Offline"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyUsersData />
                    )}
            </div>
        </div>
    )
}

export default UsersList