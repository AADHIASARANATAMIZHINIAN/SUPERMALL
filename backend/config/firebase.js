const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

let firebaseDb = null;

const connectFirebase = async () => {
  try {
    // Initialize Firebase Admin SDK
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });

    firebaseDb = admin.database();
    
    // Test connection
    await firebaseDb.ref('.info/connected').once('value');
    
    logger.info('Firebase Real-time Database connected successfully');
    
    return firebaseDb;
  } catch (error) {
    logger.error('Firebase initialization error:', error);
    throw error;
  }
};

const getFirebaseDb = () => {
  if (!firebaseDb) {
    throw new Error('Firebase not initialized. Call connectFirebase() first.');
  }
  return firebaseDb;
};

const getFirebaseAdmin = () => {
  return admin;
};

module.exports = {
  connectFirebase,
  getFirebaseDb,
  getFirebaseAdmin
};
