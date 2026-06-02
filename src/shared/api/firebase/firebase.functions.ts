import { getFunctions } from 'firebase/functions'
import { firebaseApp } from './firebase.app'
import { firebaseEnv } from './firebase.env'

export const firebaseFunctions = getFunctions(firebaseApp, firebaseEnv.functionsRegion)
