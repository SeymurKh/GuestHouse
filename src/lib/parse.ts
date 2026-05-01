// Parse helper functions for JSON fields
import { Language } from './i18n'

export const parseAmenities = (amenitiesValue: unknown): string[] => {
  if (!amenitiesValue) return []

  if (typeof amenitiesValue === 'string') {
    try {
      const parsed = JSON.parse(amenitiesValue)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  if (Array.isArray(amenitiesValue)) {
    return amenitiesValue.filter((item): item is string => typeof item === 'string')
  }

  if (typeof amenitiesValue === 'object' && amenitiesValue !== null) {
    return []
  }

  return []
}

// Parse localized amenities for specific language
export const parseLocalizedAmenities = (
  amenitiesValue: unknown,
  lang: Language
): string[] => {
  if (!amenitiesValue) return []

  const parsedValue = typeof amenitiesValue === 'string'
    ? (() => {
      try {
        return JSON.parse(amenitiesValue)
      } catch {
        return null
      }
    })()
    : amenitiesValue

  if (Array.isArray(parsedValue)) {
    return parsedValue.filter((item): item is string => typeof item === 'string')
  }

  if (typeof parsedValue === 'object' && parsedValue !== null) {
    const localized = parsedValue as Record<string, unknown>
    const value = localized[lang] ?? localized.ru ?? localized.en ?? localized.az
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string')
    }
    if (typeof value === 'string') {
      return [value]
    }
  }

  return []
}

export const parseAdvantages = (advantagesValue: unknown): string[] => {
  if (!advantagesValue) return []

  const parsedValue = typeof advantagesValue === 'string'
    ? (() => {
      try {
        return JSON.parse(advantagesValue)
      } catch {
        return null
      }
    })()
    : advantagesValue

  if (Array.isArray(parsedValue)) {
    return parsedValue.filter((item): item is string => typeof item === 'string')
  }

  return []
}

// Parse localized advantages for specific language
export const parseLocalizedAdvantages = (
  advantagesValue: unknown,
  lang: Language
): string[] => {
  if (!advantagesValue) return []

  const parsedValue = typeof advantagesValue === 'string'
    ? (() => {
      try {
        return JSON.parse(advantagesValue)
      } catch {
        return null
      }
    })()
    : advantagesValue

  if (Array.isArray(parsedValue)) {
    return parsedValue.filter((item): item is string => typeof item === 'string')
  }

  if (typeof parsedValue === 'object' && parsedValue !== null) {
    const localized = parsedValue as Record<string, unknown>
    const value = localized[lang] ?? localized.ru ?? localized.en ?? localized.az
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string')
    }
    if (typeof value === 'string') {
      return [value]
    }
  }

  return []
}

export const parseImages = (imagesValue: unknown): string[] => {
  if (!imagesValue) return []

  if (typeof imagesValue === 'string') {
    try {
      const parsed = JSON.parse(imagesValue)
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
    } catch {
      return []
    }
  }

  if (Array.isArray(imagesValue)) {
    return imagesValue.filter((item): item is string => typeof item === 'string')
  }

  return []
}
