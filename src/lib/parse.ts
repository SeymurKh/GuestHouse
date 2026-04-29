// Parse helper functions for JSON fields
import { Language } from './i18n'

export const parseAmenities = (amenitiesStr: string | null | undefined): string[] => {
  if (!amenitiesStr) return []
  try {
    const parsed = JSON.parse(amenitiesStr)
    return Array.isArray(parsed) ? parsed : []
  } catch { 
    return [] 
  }
}

export const parseAdvantages = (advantagesStr: string | null | undefined): string[] => {
  if (!advantagesStr) return []
  try {
    const parsed = JSON.parse(advantagesStr)
    // Old format: simple array
    if (Array.isArray(parsed)) return parsed
    // New format: localized object
    return []
  } catch { 
    return [] 
  }
}

// Parse localized advantages for specific language
export const parseLocalizedAdvantages = (
  advantagesStr: string | null | undefined, 
  lang: Language
): string[] => {
  if (!advantagesStr) return []
  try {
    const parsed = JSON.parse(advantagesStr)
    // Old format: simple array - return as-is
    if (Array.isArray(parsed)) return parsed
    // New format: localized object { ru: [], az: [], en: [] }
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed[lang] || parsed.ru || []
    }
    return []
  } catch { 
    return [] 
  }
}

export const parseImages = (imagesStr: string | null | undefined): string[] => {
  if (!imagesStr) return []
  try {
    const parsed = JSON.parse(imagesStr)
    return Array.isArray(parsed) ? parsed : []
  } catch { 
    return [] 
  }
}
