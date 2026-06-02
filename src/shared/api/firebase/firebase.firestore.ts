import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from './firebase.app'

export const firebaseFirestore = getFirestore(firebaseApp)
