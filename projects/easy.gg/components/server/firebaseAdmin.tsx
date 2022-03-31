import * as admin from 'firebase-admin';

const creds = process.env.FIREBASE_CREDS;

export const initializeFirebase = () => {
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(creds || '')),
            storageBucket: 'ezgg-14fd6.appspot.com'
        })
        
    }
}