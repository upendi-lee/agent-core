import 'server-only';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
// Note: In a real production environment, you should use environment variables for credentials.
// For this local setup, we'll try to use default credentials or a service account if provided.
// If no credentials are provided, it might fail or fallback to default Google Cloud credentials.

const firebaseConfig = {
    credential: process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
        : undefined,
    projectId: process.env.FIREBASE_PROJECT_ID,
};

// Check if firebase app is already initialized
const apps = getApps();

let dbInstance: any = null;

export const getDb = () => {
    console.log('getDb called. FIREBASE_SERVICE_ACCOUNT_KEY:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 'Set' : 'Missing');
    if (dbInstance) return dbInstance;

    // Check for credentials before attempting initialization
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is missing. Skipping Firebase initialization.');
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is missing');
    }

    try {
        const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
        dbInstance = getFirestore(app);
        return dbInstance;
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        throw error;
    }
};
