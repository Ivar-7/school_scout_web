import type { FirebaseOptions } from 'firebase/app'
import { firebaseEnv } from './firebase.env'

export const firebaseConfig: FirebaseOptions = {
  apiKey: firebaseEnv.apiKey,
  authDomain: firebaseEnv.authDomain,
  projectId: firebaseEnv.projectId,
  storageBucket: firebaseEnv.storageBucket,
  messagingSenderId: firebaseEnv.messagingSenderId,
  appId: firebaseEnv.appId,
  ...(firebaseEnv.measurementId ? { measurementId: firebaseEnv.measurementId } : {}),
  ...(firebaseEnv.databaseURL ? { databaseURL: firebaseEnv.databaseURL } : {}),
}
