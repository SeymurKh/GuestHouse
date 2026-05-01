import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { verifyPassword, verifyAdminToken, generateAdminToken } from '../lib/middleware'

describe('middleware utilities', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns true for matching passwords', () => {
    expect(verifyPassword('secret', 'secret')).toBe(true)
  })

  it('returns false for different passwords', () => {
    expect(verifyPassword('secret', 'wrong')).toBe(false)
  })

  it('accepts ADMIN_TOKEN when provided', () => {
    process.env.ADMIN_TOKEN = 'token123'
    expect(verifyAdminToken('token123')).toBe(true)
  })

  it('accepts generated admin token when ADMIN_PASSWORD is configured', () => {
    process.env.ADMIN_PASSWORD = 'supersecret'
    const token = generateAdminToken()
    expect(verifyAdminToken(token)).toBe(true)
  })

  it('rejects invalid admin tokens', () => {
    process.env.ADMIN_TOKEN = 'token123'
    expect(verifyAdminToken('invalid')).toBe(false)
  })

  it('returns false when no admin environment variables exist', () => {
    delete process.env.ADMIN_TOKEN
    delete process.env.ADMIN_PASSWORD
    expect(verifyAdminToken('anything')).toBe(false)
  })
})
