import dotenv from 'dotenv';
import path from 'path';

import fs from 'fs';

// Look for .env in server/ or the root monorepo directory
const envPathServer = path.resolve(process.cwd(), '.env');
const envPathRoot = path.resolve(process.cwd(), '../.env');

if (fs.existsSync(envPathServer)) {
  dotenv.config({ path: envPathServer });
} else if (fs.existsSync(envPathRoot)) {
  dotenv.config({ path: envPathRoot });
} else {
  // Fallback for dist structure
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  },
  encryption: {
    secretKey: process.env.ENCRYPTION_SECRET_KEY || 'default-secret-key-change-me',
    iv: process.env.ENCRYPTION_IV || 'default-iv-16byt',
  },
};
