import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Verify admin authentication token
 * Uses timing-safe comparison to prevent timing attacks
 */
export function verifyAdminToken(token: string | null): boolean {
  const expectedToken = process.env.ADMIN_TOKEN
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!token) {
    return false
  }

  try {
    const tokenBuffer = Buffer.from(token)

    if (expectedToken) {
      const expectedBuffer = Buffer.from(expectedToken)
      return tokenBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(tokenBuffer, expectedBuffer)
    }

    if (expectedPassword) {
      const passwordBuffer = Buffer.from(expectedPassword)
      return tokenBuffer.length === passwordBuffer.length && crypto.timingSafeEqual(tokenBuffer, passwordBuffer)
    }
  } catch {
    return false
  }

  return false
}

/**
 * Timing-safe password comparison
 * Prevents timing attacks on password verification
 */
export function verifyPassword(inputPassword: string, correctPassword: string): boolean {
  try {
    const inputBuffer = Buffer.from(inputPassword)
    const correctBuffer = Buffer.from(correctPassword)
    
    return inputBuffer.length === correctBuffer.length && crypto.timingSafeEqual(inputBuffer, correctBuffer)
  } catch {
    return false
  }
}

export function getAuthTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim()
  }
  return request.headers.get('x-admin-token')
}

/**
 * Middleware to require admin authentication
 * Checks for admin token in request headers
 */
export function withAdminAuth(
  handler: (request: NextRequest) => Promise<Response>
): (request: NextRequest) => Promise<Response> {
  return async (request: NextRequest) => {
    const token = getAuthTokenFromRequest(request)
    
    if (!verifyAdminToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin token required' },
        { status: 401 }
      )
    }
    
    return handler(request)
  }
}

/**
 * Input validation utilities
 */
export const validateInput = {
  /**
   * Validate room data
   */
  room: (data: Record<string, unknown>) => {
    const errors: string[] = []
    
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Room name is required')
    }
    if (data.name && typeof data.name === 'string' && data.name.length > 200) {
      errors.push('Room name must be under 200 characters')
    }
    
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
      errors.push('Room description is required')
    }
    
    const price = parseFloat(String(data.price || 0))
    if (isNaN(price) || price < 0 || price > 100000) {
      errors.push('Room price must be between 0 and 100000')
    }
    
    const capacity = parseInt(String(data.capacity || 2))
    if (isNaN(capacity) || capacity < 1 || capacity > 50) {
      errors.push('Room capacity must be between 1 and 50 guests')
    }
    
    return { isValid: errors.length === 0, errors }
  },

  /**
   * Validate review data
   */
  review: (data: Record<string, unknown>) => {
    const errors: string[] = []
    
    if (!data.guestName || typeof data.guestName !== 'string' || data.guestName.trim().length === 0) {
      errors.push('Guest name is required')
    }
    if (data.guestName && typeof data.guestName === 'string' && data.guestName.length > 100) {
      errors.push('Guest name must be under 100 characters')
    }
    
    const rating = parseInt(String(data.rating || 0))
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push('Rating must be between 1 and 5')
    }
    
    if (!data.comment || typeof data.comment !== 'string' || data.comment.trim().length === 0) {
      errors.push('Comment is required')
    }
    if (data.comment && typeof data.comment === 'string' && data.comment.length > 1000) {
      errors.push('Comment must be under 1000 characters')
    }
    
    return { isValid: errors.length === 0, errors }
  },

  /**
   * Validate settings data
   */
  settings: (data: Record<string, unknown>) => {
    const errors: string[] = []
    
    if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
      errors.push('Phone is required')
    }
    if (data.phone && typeof data.phone === 'string' && data.phone.length > 50) {
      errors.push('Phone must be under 50 characters')
    }
    
    if (data.email && typeof data.email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (data.email && !emailRegex.test(data.email)) {
        errors.push('Invalid email format')
      }
    }
    
    if (data.address && typeof data.address === 'string' && data.address.length > 200) {
      errors.push('Address must be under 200 characters')
    }
    
    if (data.description && typeof data.description === 'string' && data.description.length > 1000) {
      errors.push('Description must be under 1000 characters')
    }
    
    return { isValid: errors.length === 0, errors }
  }
}

/**
 * Sanitization utilities
 */
export const sanitize = {
  /**
   * Basic HTML/script tag removal
   */
  text: (input: string): string => {
    if (typeof input !== 'string') {
      return ''
    }
    return input
      .trim()
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .slice(0, 1000) // Max length
  },

  /**
   * Sanitize email
   */
  email: (input: string): string => {
    if (typeof input !== 'string') {
      return ''
    }
    return input.trim().toLowerCase().slice(0, 100)
  },

  /**
   * Sanitize phone
   */
  phone: (input: string): string => {
    if (typeof input !== 'string') {
      return ''
    }
    return input.trim().slice(0, 50)
  }
}
