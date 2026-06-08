import admin from 'firebase-admin';
import { config } from '../config';

import fs from 'fs';
import path from 'path';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    console.log('Initializing Firebase Admin SDK with serviceAccountKey.json');
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    console.log('Initializing Firebase Admin SDK with environment variables');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
    });
  }
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
  otps: db.collection('otps'),
};

export default admin;
