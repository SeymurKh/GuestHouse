import { describe, it, expect } from 'vitest'
import {
  parseImages,
  parseAmenities,
  parseLocalizedAmenities,
  parseAdvantages,
  parseLocalizedAdvantages,
} from '../lib/parse'
import { type Language } from '../lib/i18n'

describe('parse utilities', () => {
  it('parses images from JSON string', () => {
    expect(parseImages('["/img/a.jpg","/img/b.jpg"]')).toEqual(['/img/a.jpg', '/img/b.jpg'])
  })

  it('returns empty array for invalid image JSON', () => {
    expect(parseImages('not json')).toEqual([])
  })

  it('parses non-localized amenities array', () => {
    expect(parseAmenities('["Wi-Fi","TV"]')).toEqual(['Wi-Fi', 'TV'])
  })

  it('parses localized amenities object for requested language', () => {
    const value = JSON.stringify({ ru: ['Wi-Fi'], az: ['Wi-Fi'], en: ['Wi-Fi'] })
    expect(parseLocalizedAmenities(value, 'en')).toEqual(['Wi-Fi'])
  })

  it('falls back to ru when localized amenities missing language', () => {
    const value = JSON.stringify({ ru: ['Wi-Fi'] })
    expect(parseLocalizedAmenities(value, 'en')).toEqual(['Wi-Fi'])
  })

  it('parses advantages as legacy array', () => {
    expect(parseAdvantages('["Item1","Item2"]')).toEqual(['Item1', 'Item2'])
  })

  it('parses localized advantages object for requested language', () => {
    const value = JSON.stringify({ ru: ['One'], az: ['Bir'], en: ['One'] })
    expect(parseLocalizedAdvantages(value, 'az')).toEqual(['Bir'])
  })

  it('returns empty arrays for invalid localized advantages', () => {
    expect(parseLocalizedAdvantages('invalid-json', 'ru')).toEqual([])
  })
})
