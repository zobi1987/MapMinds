import type { Language } from '../i18n'
import type { Landmark } from '../domain/landmarkSchema'
import { englishLandmarkNames, englishLandmarkTranslations } from './landmarkTranslations.en'

export function localizeLandmark(landmark: Landmark, language: Language): Landmark {
  if (language === 'de') return landmark
  const translation = englishLandmarkTranslations[landmark.id]
  if (!translation) return landmark

  return {
    ...landmark,
    name: englishLandmarkNames[landmark.wikidataId] ?? landmark.name,
    aliases: [...landmark.aliases, landmark.name],
    hints: translation.hints,
    summary: translation.summary,
    place: {
      ...landmark.place,
      name: translation.place.name,
      country: translation.place.country,
    },
  }
}
