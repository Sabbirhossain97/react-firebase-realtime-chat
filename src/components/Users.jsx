import { useEffect } from 'react';
import useProfile from '../hooks/useProfile'
import UsersList from './UsersList';
import { LogOut } from 'lucide-react'
import { auth } from '../firebase/config';
import { ref, onDisconnect, set, serverTimestamp } from "firebase/database";
import { signOut } from 'firebase/auth';
import { db } from '../firebase/config';

function Users() {
    const { user } = useProfile();
  
    useEffect(() => {
        if (!user) return;

        const userStatusRef = ref(db, `users/${user.uid}`);

        set(userStatusRef, {
            email: user.email,
            online: true,
            lastSeen: serverTimestamp()
        });

        onDisconnect(userStatusRef).set({
            email: user.email,
            online: false,
            lastSeen: serverTimestamp()
        })

    }, [user])


    return (
        <div className="flex flex-col w-1/4 border-r border-gray-700 h-screen">
            <UsersList currentUser={user} />
            <div className="border-t space-y-2 border-gray-700 px-6 py-4 overflow-hidden">
                <p className="text-md  font-semibold">{user?.email}</p>
                <button onClick={() => signOut(auth)} className='text-md flex gap-2 items-center'>
                    <LogOut className='h-4 w-4 text-gray-400' />
                    <span className='text-gray-400'>Sign out</span>
                </button>
            </div>
        </div>
    )
}

export default Users