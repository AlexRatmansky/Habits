import admin from 'firebase-admin';

export { admin, db };

admin.initializeApp();

const db = admin.firestore();
