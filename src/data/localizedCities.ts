import type { Language } from '../i18n'
import type { City } from '../domain/citySchema'
import { englishCityNames, englishCityTranslations } from './cityTranslations.en'

export function localizeCity(city: City, language: Language): City {
  if (language === 'de') return city
  const translation = englishCityTranslations[city.id]
  if (!translation) return city

  return {
    ...city,
    name: englishCityNames[city.wikidataId] ?? city.name,
    aliases: [...city.aliases, city.name],
    hints: translation.hints,
    summary: translation.summary,
    place: {
      ...city.place,
      name: translation.place.name,
      country: translation.place.country,
    },
  }
}
