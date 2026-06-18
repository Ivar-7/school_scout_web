import { FirebaseError } from 'firebase/app'

const FRIENDLY_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/user-disabled': 'This account has been disabled. Contact support for help.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account with that email already exists.',
  'auth/weak-password': 'Choose a stronger password (at least 6 characters).',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
  'auth/requires-recent-login': 'Please sign in again to continue.',
  'permission-denied': "You don't have permission to do that.",
  'not-found': "We couldn't find what you were looking for.",
  unavailable: 'Service is temporarily unavailable. Please try again shortly.',
  'resource-exhausted': 'Too many requests right now. Please try again shortly.',
  unauthenticated: 'Please sign in to continue.',
  cancelled: 'The request was cancelled.',
  'deadline-exceeded': 'The request took too long. Please try again.',
  'already-exists': 'That already exists.',
  'invalid-argument': 'Some of the provided information is invalid.',
}

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.'

export function getErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    const shortCode = error.code.split('/').pop() ?? ''
    return FRIENDLY_MESSAGES[error.code] ?? FRIENDLY_MESSAGES[shortCode] ?? FALLBACK_MESSAGE
  }

  return FALLBACK_MESSAGE
}

export function logError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error)
  }
}

export function handleError(context: string, error: unknown): string {
  logError(context, error)
  return getErrorMessage(error)
}
