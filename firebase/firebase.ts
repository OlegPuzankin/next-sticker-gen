import { firebaseConfig } from './config';
import app from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'


class Firebase {

    public auth: app.auth.Auth;
    public db: app.firestore.Firestore;

    constructor() {
        if (!app.apps.length)
            !app.apps.length ? app.initializeApp(firebaseConfig) : app.app()
        this.auth = app.auth();
        this.db = app.firestore();
    }

    async register(name: string, email: string, password: string) {

        const newUser = await this.auth.createUserWithEmailAndPassword(email, password);

        const userRef = this.db.doc(`users/${newUser.user.uid}`);


        const createdAt = new Date();
        try {
            await userRef.set({ email, createdAt, name, admin: false })
        } catch (e) {
            console.log(e.message)
        }


        // return await newUser.user.updateProfile({
        //     displayName: name
        // })


    }

    async login(email: string, password: string) {
        return await this.auth.signInWithEmailAndPassword(email, password);

    }
    async logout() {
        await this.auth.signOut();

    }


    async resetPassword(email: string) {
        await this.auth.sendPasswordResetEmail(email);
    }

}

export const fbInstance = new Firebase();


