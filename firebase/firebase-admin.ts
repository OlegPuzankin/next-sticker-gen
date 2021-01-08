import admin from 'firebase-admin'
// const serviceAccount = require('./wine-sticker-generator-firebase-adminsdk.json');



class FirebaseAdmin {
    public auth: admin.auth.Auth

    private _serviceAccount = {
        type: "service_account",
        project_id: "wine-sticker-generator",
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: "firebase-adminsdk-7qdwb@wine-sticker-generator.iam.gserviceaccount.com",
        client_id: "111203989732973544818",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7qdwb%40wine-sticker-generator.iam.gserviceaccount.com"
    }



    constructor() {
        // const serviceAccountString = JSON.stringify(this._serviceAccount)

        if (!admin.apps.length) {
            admin.initializeApp({
                //@ts-ignore
                credential: admin.credential.cert(this._serviceAccount),
                databaseURL: 'https://wine-sticker-generator.firebaseio.com'
            });
        }
        debugger


        this.auth = admin.auth()
    }

}

export const fbAdminInstance = new FirebaseAdmin()