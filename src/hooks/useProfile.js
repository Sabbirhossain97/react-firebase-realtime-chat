import { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const useProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if(user){
                setUser(currentUser)
            } else {
                setUser(null)
            }
        });

        return () => unsubscribe()
    }, [])

    return { user }
}

export default useProfile