import { getAuth, User } from "firebase/auth"
import { useEffect, useState } from "react";
import { app } from "../../pages/_app";

export const useAuth = () => {
    const firebaseAuth = getAuth(app);
    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(authedUser => {
            if (authedUser) {
                setUser(authedUser)
            } else {
                setUser(null);
            }
        })
        return () => {
            unsubscribe();
        }
    }, [firebaseAuth])

    

    return { user, firebaseAuth }
}