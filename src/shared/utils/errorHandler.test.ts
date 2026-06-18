import { describe, it, expect } from 'vitest'
import { FirebaseError } from 'firebase/app'
import { getErrorMessage } from './errorHandler'

describe('getErrorMessage', () => {
  it('maps known Firebase Auth error codes to friendly messages', () => {
    const error = new FirebaseError('auth/wrong-password', 'Wrong password')
    expect(getErrorMessage(error)).toBe('Incorrect password. Please try again.')
  })

  it('maps Cloud Functions callable error codes by their short form', () => {
    const error = new FirebaseError('functions/unauthenticated', 'Unauthenticated')
    expect(getErrorMessage(error)).toBe('Please sign in to continue.')
  })

  it('falls back to a generic message for unrecognized Firebase error codes', () => {
    const error = new FirebaseError('auth/some-new-code', 'Something new')
    expect(getErrorMessage(error)).toBe('Something went wrong. Please try again.')
  })

  it('falls back to a generic message for non-Firebase errors', () => {
    expect(getErrorMessage(new Error('plain error'))).toBe(
      'Something went wrong. Please try again.'
    )
    expect(getErrorMessage('a string')).toBe('Something went wrong. Please try again.')
    expect(getErrorMessage(undefined)).toBe('Something went wrong. Please try again.')
  })
})
