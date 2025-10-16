import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UsersList from './UsersList';
import { LogOut, X } from 'lucide-react'
import { auth, db } from '../firebase/config';
import { ref, onDisconnect, set, serverTimestamp } from "firebase/database";
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Spinner from './Spinner';

function Users({ chatSideBar, setChatSideBar }) {
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
            }, 500);
        } catch (error) {
            console.error(error.message);
            toast.error(error.message, {
                position: 'top-center'
            });
        }
    };

    return (
        <>
            <div className="hidden lg:flex flex-col w-1/4 border-r border-gray-700 h-screen justify-between">
                <div className="flex-1 overflow-y-auto">
                    <UsersList />
                </div>
                <div className="border-t space-y-2 border-gray-700 px-6 py-4 ">
                    <p className="text-md truncate font-semibold">{user?.email}</p>
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
            <div className={`${chatSideBar ? "translate-x-0" : '-translate-x-full'} transition duration-300 fixed shadow-r-xl left-0 bottom-0 w-10/12 sm:w-3/4 md:w-1/2 z-50 h-full rounded lg:hidden bg-slate-900`}>
                <button
                    className="absolute top-7 right-4 text-white"
                    onClick={() => setChatSideBar(false)}
                >
                    <X />
                </button>
                <div className="w-full flex flex-col border-r border-gray-700 h-screen justify-between">
                    <div className="flex-1 overflow-y-auto">
                        <UsersList />
                    </div>
                    <div className="border-t space-y-2 border-gray-700 px-6 py-4 ">
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
            </div>
        </>
    )
}

export default Users