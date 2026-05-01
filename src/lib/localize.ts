// Localized content helpers
import { Language } from './i18n'

// Type for localized string stored in DB
export type LocalizedString = string | string[] | { ru?: string | string[]; az?: string | string[]; en?: string | string[] }

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
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        const langValue = parsed[lang] || parsed.ru || parsed.en || parsed.az || fallback
        // Handle arrays - join with comma
        if (Array.isArray(langValue)) {
          return langValue.join(', ')
        }
        return String(langValue)
      }
    } catch {
      // Not JSON, return as-is
      return value
    }
    return value
  }
  
  // If it's an object (already parsed)
  if (typeof value === 'object' && !Array.isArray(value)) {
    const langValue = value[lang] || value.ru || value.en || value.az || fallback
    // Handle arrays - join with comma
    if (Array.isArray(langValue)) {
      return langValue.join(', ')
    }
    return String(langValue)
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

// Helper to convert value to string (handles arrays by joining with newline)
function valueToString(val: unknown): string {
  if (Array.isArray(val)) {
    return val.join('\n')
  }
  if (typeof val === 'string') {
    return val
  }
  return ''
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
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return {
          ru: valueToString(parsed.ru),
          az: valueToString(parsed.az),
          en: valueToString(parsed.en),
        }
      }
    } catch {
      // Not JSON, treat as Russian (old data)
      return { ru: value, az: '', en: '' }
    }
    return defaultVal
  }
  
  if (typeof value === 'object' && !Array.isArray(value)) {
    return {
      ru: valueToString(value.ru),
      az: valueToString(value.az),
      en: valueToString(value.en),
    }
  }
  
  return defaultVal
}
