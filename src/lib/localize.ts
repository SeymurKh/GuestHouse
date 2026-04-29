// Localized content helpers
import { Language } from './i18n'

// Type for localized string stored in DB
export type LocalizedString = string | { ru?: string; az?: string; en?: string }

// Parse localized string - returns the value for current language, or fallback
export function getLocalizedValue(
  value: LocalizedString | null | undefined,
  lang: Language,
  fallback: string = ''
): string {
  if (!value) return fallback
  
  // If it's already a plain string (old data), return it
  if (typeof value === 'string') {
    // Try to parse as JSON (new format)
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed[lang] || parsed.ru || parsed.en || parsed.az || fallback
      }
    } catch {
      // Not JSON, return as-is
      return value
    }
    return value
  }
  
  // If it's an object (already parsed)
  if (typeof value === 'object') {
    return value[lang] || value.ru || value.en || value.az || fallback
  }
  
  return fallback
}

// Create localized JSON string from form values
export function createLocalizedString(
  ru: string,
  az: string,
  en: string
): string {
  return JSON.stringify({ ru, az, en })
}

// Parse localized string to object for form editing
export function parseLocalizedStringToForm(
  value: LocalizedString | null | undefined
): { ru: string; az: string; en: string } {
  const defaultVal = { ru: '', az: '', en: '' }
  
  if (!value) return defaultVal
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          ru: parsed.ru || '',
          az: parsed.az || '',
          en: parsed.en || '',
        }
      }
    } catch {
      // Not JSON, treat as Russian (old data)
      return { ru: value, az: '', en: '' }
    }
    return defaultVal
  }
  
  if (typeof value === 'object') {
    return {
      ru: value.ru || '',
      az: value.az || '',
      en: value.en || '',
    }
  }
  
  return defaultVal
}
