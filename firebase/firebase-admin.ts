import admin from 'firebase-admin'
import { serviceAccount } from './wine-sticker-generator-firebase-adminsdk'



class FirebaseAdmin {
    public auth: admin.auth.Auth


    constructor() {
        // const serviceAccountString = JSON.stringify(this._serviceAccount)

        serviceAccount.private_key_id = process.env.FIREBASE_PRIVATE_KEY_ID
        serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')


        if (!admin.apps.length) {
            admin.initializeApp({
                //@ts-ignore
                credential: admin.credential.cert(serviceAccount),
                databaseURL: 'https://wine-sticker-generator.firebaseio.com'
            });
        }
        debugger


        this.auth = admin.auth()
    }

}

export const fbAdminInstance = new FirebaseAdmin()