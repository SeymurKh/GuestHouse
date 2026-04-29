// Parse helper functions for JSON fields

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
    return Array.isArray(parsed) ? parsed : []
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
