import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase/config";
import { UserRound } from 'lucide-react'
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

function UsersList() {
    const [userList, setUserList] = useState([]);
    const { user: currentUser } = useAuth();
    const { selectUser, selectedUser } = useChat();

    useEffect(() => {
        if (currentUser) {
            const usersRef = ref(db, "users");
           const unsubscribe= onValue(usersRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const allUsers = Object.entries(data).map(([uid, info]) => ({
                        uid,
                        ...info,
                    }));
                    const filteredUsers = currentUser ? allUsers.filter((u) => u.uid !== currentUser.uid) : allUsers
                    setUserList(filteredUsers);
                } else {
                    setUsers([]);
                }
            });

            return () => unsubscribe()
        }
    }, [currentUser]);

    console.log(selectedUser)

    return (
        <div >
            <div className="px-4 py-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold">Users ({userList?.length})</h1>
            </div>
            <div className="h-[750px] overflow-y-auto space-y-4 p-4">
                {currentUser && userList.map((u) => (
                    <div
                        key={u.uid}
                        className="w-full px-2 py-4 bg-slate-800/80 hover:opacity-75 cursor-pointer rounded-md transition duration-300"
                        onClick={() => selectUser(u, currentUser.uid)}
                    >
                        <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                                <div>
                                    <UserRound className='rounded-full p-2 border border-white/10 h-10 w-10 text-lg' />
                                </div>

                                <div>
                                    <p className="text-[16px] font-semibold">{u.email}</p>
                                    <p
                                        className={`text-sm ${u.online ? "text-green-400" : "text-gray-400"
                                            }`}
                                    >
                                        {u.online ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UsersList