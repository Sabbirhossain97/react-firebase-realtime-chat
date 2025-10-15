import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import { UserRound } from 'lucide-react'

function UsersList({ currentUser }) {
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        const usersRef = ref(db, "users");
        const unsubscribe = onValue(usersRef, (snapshot) => {
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

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <div className="px-4 py-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold">Users ({userList?.length})</h1>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {userList.map((u) => (
                    <div
                        key={u.uid}
                        className="w-full px-6 py-4 bg-slate-800/80 hover:opacity-75 cursor-pointer rounded-md transition duration-300"
                    >
                        <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                                <UserRound
                                    className={u.online ? "text-green-400" : "text-gray-500"}
                                />
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