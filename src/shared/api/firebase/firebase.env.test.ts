import { afterEach, describe, expect, it, vi } from 'vitest'
import { firebaseEnv, parseFirebaseEnv } from './firebase.env'

const validEnv = {
  VITE_FIREBASE_API_KEY: 'test-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'example.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'example-project',
  VITE_FIREBASE_STORAGE_BUCKET: 'example-project.firebasestorage.app',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '1234567890',
  VITE_FIREBASE_APP_ID: '1:1234567890:web:abcdef',
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('parseFirebaseEnv', () => {
  it('parses required Firebase env vars and applies default functions region', () => {
    const parsed = parseFirebaseEnv(validEnv)

    expect(parsed).toEqual({
      apiKey: 'test-api-key',
      authDomain: 'example.firebaseapp.com',
      projectId: 'example-project',
      storageBucket: 'example-project.firebasestorage.app',
      messagingSenderId: '1234567890',
      appId: '1:1234567890:web:abcdef',
      measurementId: undefined,
      databaseURL: undefined,
      functionsRegion: 'us-central1',
    })
  })

  it('treats blank optional values as unset while preserving provided values', () => {
    const parsed = parseFirebaseEnv({
      ...validEnv,
      VITE_FIREBASE_MEASUREMENT_ID: '  ',
      VITE_FIREBASE_DATABASE_URL: 'https://example.firebaseio.com',
      VITE_FIREBASE_FUNCTIONS_REGION: 'europe-west1',
    })

    expect(parsed.measurementId).toBeUndefined()
    expect(parsed.databaseURL).toBe('https://example.firebaseio.com')
    expect(parsed.functionsRegion).toBe('europe-west1')
  })

  it('throws a clear error when required env vars are missing or empty', () => {
    expect(() =>
      parseFirebaseEnv({
        ...validEnv,
        VITE_FIREBASE_PROJECT_ID: '',
      })
    ).toThrow(/VITE_FIREBASE_PROJECT_ID/)
  })

  it('reads stubbed Vite env variables lazily through firebaseEnv', () => {
    for (const [key, value] of Object.entries(validEnv)) {
      vi.stubEnv(key, value)
    }
    vi.stubEnv('VITE_FIREBASE_FUNCTIONS_REGION', '')

    expect(firebaseEnv.projectId).toBe('example-project')
    expect(firebaseEnv.functionsRegion).toBe('us-central1')
  })
})
