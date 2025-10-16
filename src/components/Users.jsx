import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UsersList from './UsersList';
import { LogOut } from 'lucide-react'
import { auth } from '../firebase/config';
import { ref, onDisconnect, set, serverTimestamp } from "firebase/database";
import { signOut } from 'firebase/auth';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Spinner from './Spinner';

function Users() {
    const { user } = useAuth();
    const [signOutLoading, setSignOutLoading] = useState(false)
    const navigate = useNavigate();

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

    const handleSignOut = async () => {
        setSignOutLoading(true);
        try {
            if (user) {
                const userStatusRef = ref(db, `users/${user.uid}`);
                await set(userStatusRef, {
                    email: user.email,
                    online: false,
                    lastSeen: serverTimestamp()
                });
            }

            await signOut(auth);

            setTimeout(() => {
                setSignOutLoading(false);
                navigate("/");
                toast.success('Sign out successful!', {
                    position: 'top-center'
                });
            }, 1500);
        } catch (error) {
            console.error(error.message);
            toast.error(error.message, {
                position: 'top-center'
            });
        }
    };

    return (
        <div className="flex flex-col w-1/4 border-r border-gray-700 h-screen">
            <UsersList />
            <div className="border-t space-y-2 border-gray-700 px-6 py-4 overflow-hidden">
                <p className="text-md  font-semibold">{user?.email}</p>
                <button onClick={handleSignOut} className='text-md flex gap-2 items-center'>
                    {signOutLoading ? <span className="flex gap-2 items-center"><Spinner /> Processing</span> :
                        <p className='group flex gap-2 items-center transition-all duration-300 cursor-pointer'>
                            <LogOut className='h-4 w-4 text-gray-400 group-hover:text-white' />
                            <span className='text-gray-400 group-hover:text-white'> Sign out
                            </span>
                        </p>}
                </button>
            </div>
        </div>
    )
}

export default Users