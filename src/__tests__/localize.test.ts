import { describe, it, expect } from 'vitest'
import { getLocalizedValue, parseLocalizedStringToForm, createLocalizedString } from '../lib/localize'
import { type Language } from '../lib/i18n'

describe('localize utilities', () => {
  it('returns fallback when value is null', () => {
    expect(getLocalizedValue(null, 'ru', 'fallback')).toBe('fallback')
  })

  it('returns plain string when value is not JSON', () => {
    expect(getLocalizedValue('Hello', 'en')).toBe('Hello')
  })

  it('returns language-specific value from JSON string', () => {
    const value = JSON.stringify({ ru: 'Привет', az: 'Salam', en: 'Hello' })
    expect(getLocalizedValue(value, 'az')).toBe('Salam')
  })

  it('falls back to ru when requested language missing', () => {
    const value = JSON.stringify({ ru: 'Привет' })
    expect(getLocalizedValue(value, 'en', 'fallback')).toBe('Привет')
  })

  it('parses localized string object to form fields', () => {
    const value = JSON.stringify({ ru: 'Привет', az: 'Salam', en: 'Hello' })
    expect(parseLocalizedStringToForm(value)).toEqual({ ru: 'Привет', az: 'Salam', en: 'Hello' })
  })

  it('parses plain string as ru legacy data', () => {
    expect(parseLocalizedStringToForm('Hello')).toEqual({ ru: 'Hello', az: '', en: '' })
  })

  it('creates localized JSON string', () => {
    expect(createLocalizedString('Привет', 'Salam', 'Hello')).toBe(JSON.stringify({ ru: 'Привет', az: 'Salam', en: 'Hello' }))
  })
})
