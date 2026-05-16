import admin from 'firebase-admin';
import { config } from '../config';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.clientEmail,
      privateKey: config.firebase.privateKey,
    }),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

// Collection references
export const collections = {
  users: db.collection('users'),
  tasks: db.collection('tasks'),
  expenses: db.collection('expenses'),
  passwords: db.collection('passwords'),
  timeEntries: db.collection('timeEntries'),
  foodEntries: db.collection('foodEntries'),
  reports: db.collection('reports'),
};

export default admin;
