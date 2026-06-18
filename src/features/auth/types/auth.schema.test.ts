import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from './auth.schema'

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'parent@example.com', password: 'secret123' })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret123' })
    expect(result.success).toBe(false)
  })

  it('rejects a password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'parent@example.com', password: 'abc' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const base = {
    displayName: 'Jane Parent',
    email: 'parent@example.com',
    phone: '0712345678',
    role: 'parent' as const,
    password: 'secret123',
    confirmPassword: 'secret123',
  }

  it('accepts a fully valid registration', () => {
    expect(registerSchema.safeParse(base).success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({ ...base, confirmPassword: 'different' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('confirmPassword'))).toBe(true)
    }
  })

  it('rejects an invalid role', () => {
    const result = registerSchema.safeParse({ ...base, role: 'admin' })
    expect(result.success).toBe(false)
  })

  it('rejects a too-short display name', () => {
    const result = registerSchema.safeParse({ ...base, displayName: 'J' })
    expect(result.success).toBe(false)
  })
})
