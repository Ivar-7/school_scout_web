import { z } from 'zod'

const optionalNonEmptyString = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().min(1).optional()
)

const requiredEnvString = (key: string) =>
  z
    .string({ error: `Missing Firebase environment variable: ${key}` })
    .trim()
    .min(1, { error: `Missing Firebase environment variable: ${key}` })

const firebaseEnvSchema = z.object({
  VITE_FIREBASE_API_KEY: requiredEnvString('VITE_FIREBASE_API_KEY'),
  VITE_FIREBASE_AUTH_DOMAIN: requiredEnvString('VITE_FIREBASE_AUTH_DOMAIN'),
  VITE_FIREBASE_PROJECT_ID: requiredEnvString('VITE_FIREBASE_PROJECT_ID'),
  VITE_FIREBASE_STORAGE_BUCKET: requiredEnvString('VITE_FIREBASE_STORAGE_BUCKET'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: requiredEnvString('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  VITE_FIREBASE_APP_ID: requiredEnvString('VITE_FIREBASE_APP_ID'),
  VITE_FIREBASE_MEASUREMENT_ID: optionalNonEmptyString,
  VITE_FIREBASE_DATABASE_URL: optionalNonEmptyString,
  VITE_FIREBASE_FUNCTIONS_REGION: optionalNonEmptyString.transform(
    (value) => value ?? 'us-central1'
  ),
})

export interface FirebaseEnv {
  readonly apiKey: string
  readonly authDomain: string
  readonly projectId: string
  readonly storageBucket: string
  readonly messagingSenderId: string
  readonly appId: string
  readonly measurementId?: string
  readonly databaseURL?: string
  readonly functionsRegion: string
}

/**
 * Validates and normalizes public Vite Firebase environment variables.
 */
export function parseFirebaseEnv(rawEnv: Record<string, unknown>): FirebaseEnv {
  const result = firebaseEnvSchema.safeParse(rawEnv)

  if (!result.success) {
    const missingKeys = result.error.issues.map((issue) => issue.path.join('.')).filter(Boolean)
    throw new Error(
      `Invalid Firebase environment configuration (${missingKeys.join(', ')}). Check your .env file against .env.example.`
    )
  }

  const data = result.data

  return {
    apiKey: data.VITE_FIREBASE_API_KEY,
    authDomain: data.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: data.VITE_FIREBASE_PROJECT_ID,
    storageBucket: data.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: data.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: data.VITE_FIREBASE_APP_ID,
    measurementId: data.VITE_FIREBASE_MEASUREMENT_ID,
    databaseURL: data.VITE_FIREBASE_DATABASE_URL,
    functionsRegion: data.VITE_FIREBASE_FUNCTIONS_REGION,
  }
}

export function getFirebaseEnv(): FirebaseEnv {
  return parseFirebaseEnv(import.meta.env)
}

export const firebaseEnv: FirebaseEnv = {
  get apiKey() {
    return getFirebaseEnv().apiKey
  },
  get authDomain() {
    return getFirebaseEnv().authDomain
  },
  get projectId() {
    return getFirebaseEnv().projectId
  },
  get storageBucket() {
    return getFirebaseEnv().storageBucket
  },
  get messagingSenderId() {
    return getFirebaseEnv().messagingSenderId
  },
  get appId() {
    return getFirebaseEnv().appId
  },
  get measurementId() {
    return getFirebaseEnv().measurementId
  },
  get databaseURL() {
    return getFirebaseEnv().databaseURL
  },
  get functionsRegion() {
    return getFirebaseEnv().functionsRegion
  },
}
