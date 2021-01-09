import React, { useEffect, useState } from 'react';
import { destroyCookie, setCookie, } from 'nookies';
import { fbInstance } from '../firebase/firebase';
import firebase from 'firebase';
import { I_User } from '../redux/interfaces';


export const UserContext = React.createContext<{ user: I_User }>(null)
const tokenName = 'firebaseAuthToken';


const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState<I_User | null>(null);

    const onAuthStateChange = () => {

        return fbInstance.auth.onAuthStateChanged(async (user) => {

            if (user) {
                const userRef = await fbInstance.db.doc(`users/${user.uid}`).get() as firebase.firestore.DocumentSnapshot<I_User>
                setUser({ id: userRef.id, ...userRef.data() })
                //set cookie
                const token = await user.getIdToken();
                setCookie(null, tokenName, token, {
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/',
                });
            } else {
                setUser(null)
                destroyCookie(null, tokenName);
            }
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChange();
        return () => {
            unsubscribe();
        };
    }, []);

    return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export default UserProvider;