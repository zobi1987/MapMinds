import { describe, expect, it } from 'vitest'
import { cities } from './cities'
import { localizeCity } from './localizedCities'
import { isAcceptedAnswer, normalizeAnswer } from '../domain/answerMatcher'

const contains = (value: string, banned: string) => {
  const haystack = normalizeAnswer(value)
  const needle = normalizeAnswer(banned)
  return needle.length >= 4 && haystack.includes(needle)
}

const regionByCountry: Record<string, string> = {
  Frankreich: 'europe',
  'Vereinigtes Königreich': 'europe',
  Italien: 'europe',
  Spanien: 'europe',
  Niederlande: 'europe',
  Deutschland: 'europe',
  Tschechien: 'europe',
  Österreich: 'europe',
  Griechenland: 'europe',
  Portugal: 'europe',
  Türkei: 'europe',
  Ungarn: 'europe',
  Dänemark: 'europe',
  Irland: 'europe',
  Polen: 'europe',
  Schweden: 'europe',
  Belgien: 'europe',
  Norwegen: 'europe',
  Lettland: 'europe',
  Estland: 'europe',
  Kroatien: 'europe',
  Island: 'europe',
  Rumänien: 'europe',
  USA: 'north-america',
  Kanada: 'north-america',
  Japan: 'asia',
  China: 'asia',
  'Vereinigte Arabische Emirate': 'asia',
  Thailand: 'asia',
  Südkorea: 'asia',
  Indien: 'asia',
  Vietnam: 'asia',
  Nepal: 'asia',
  Indonesien: 'asia',
  Malaysia: 'asia',
  Kambodscha: 'asia',
  Katar: 'asia',
  Pakistan: 'asia',
  Libanon: 'asia',
  'Saudi-Arabien': 'asia',
  Georgien: 'asia',
  Mongolei: 'asia',
  Usbekistan: 'asia',
  Nordkorea: 'asia',
  Jordanien: 'asia',
  Aserbaidschan: 'asia',
  Ägypten: 'africa',
  Südafrika: 'africa',
  Marokko: 'africa',
  Kenia: 'africa',
  Nigeria: 'africa',
  Ghana: 'africa',
  Senegal: 'africa',
  Mosambik: 'africa',
  Namibia: 'africa',
  Madagaskar: 'africa',
  Tansania: 'africa',
  Äthiopien: 'africa',
  Tunesien: 'africa',
  Brasilien: 'latin-america',
  Mexiko: 'latin-america',
  Argentinien: 'latin-america',
  Kuba: 'latin-america',
  Ecuador: 'latin-america',
  Panama: 'latin-america',
  Kolumbien: 'latin-america',
  Chile: 'latin-america',
  Peru: 'latin-america',
  Bolivien: 'latin-america',
  Uruguay: 'latin-america',
  Australien: 'oceania',
  Neuseeland: 'oceania',
  Fidschi: 'oceania',
}

const cityStates = ['Singapur', 'Monaco', 'Vatikanstadt', 'Luxemburg', 'San Marino', 'Andorra']

describe('Städtekatalog', () => {
  it('enthält 99 Satellitenbilder, je 33 leicht, mittel und schwer', () => {
    expect(cities).toHaveLength(99)
    expect(cities.filter((city) => city.difficulty === 'easy')).toHaveLength(33)
    expect(cities.filter((city) => city.difficulty === 'medium')).toHaveLength(33)
    expect(cities.filter((city) => city.difficulty === 'hard')).toHaveLength(33)
    expect(cities.every((city) => city.image.url.startsWith('https://'))).toBe(true)
  })

  it('bleibt weltweit, ohne Stadtstaaten und ohne mehr als sechs Städte je Land', () => {
    const perCountry = new Map<string, number>()
    for (const difficulty of ['easy', 'medium', 'hard'] as const) {
      const band = cities.filter((city) => city.difficulty === difficulty)
      const regions = new Set(band.map((city) => regionByCountry[city.place.country]))
      const europeAndNorthAmerica = band.filter((city) => {
        const region = regionByCountry[city.place.country]
        return region === 'europe' || region === 'north-america'
      }).length
      expect(europeAndNorthAmerica, difficulty).toBeLessThanOrEqual(16)
      if (difficulty !== 'easy') {
        expect(regions.has('africa'), difficulty).toBe(true)
        expect(regions.has('asia'), difficulty).toBe(true)
        expect(regions.has('latin-america'), difficulty).toBe(true)
        expect(regions.has('oceania'), difficulty).toBe(true)
      }
    }

    for (const city of cities) {
      expect(regionByCountry[city.place.country], city.id).toBeTruthy()
      expect(cityStates).not.toContain(city.place.country)
      expect(normalizeAnswer(city.name)).not.toBe(normalizeAnswer(city.place.country))
      perCountry.set(city.place.country, (perCountry.get(city.place.country) ?? 0) + 1)
    }
    for (const [country, count] of perCountry) expect(count, country).toBeLessThanOrEqual(6)
  })

  it('legt den Fakt auf Hinweis zwei und nennt das Land als dritten Hinweis', () => {
    for (const city of cities) {
      const english = localizeCity(city, 'en')
      expect(city.hints[1], city.id).toBe(city.summary)
      expect(city.hints[2], city.id).toBe(city.place.country)
      expect(english.hints[1], city.id).toBe(english.summary)
      expect(english.hints[2], city.id).toBe(english.place.country)
      const earlyHints = [city.hints[0], city.hints[1], english.hints[0], english.hints[1]]
      const banned = [city.name, city.place.country, english.name, english.place.country]
      for (const hint of earlyHints) {
        for (const term of banned) {
          expect(contains(hint, term), `${city.id}: ${hint} / ${term}`).toBe(false)
        }
      }
    }
  })

  it('zählt den Stadtnamen und nicht das Land, und lässt Birmingham in den USA weg', () => {
    const paris = cities.find((city) => city.wikidataId === 'Q90')!
    const birmingham = cities.find((city) => city.wikidataId === 'Q2256')!
    const englishParis = localizeCity(paris, 'en')
    const germanCatalog = cities
    const englishCatalog = cities.map((city) => localizeCity(city, 'en'))

    expect(isAcceptedAnswer('Paris', paris, germanCatalog)).toBe(true)
    expect(isAcceptedAnswer('Paris', englishParis, englishCatalog)).toBe(true)
    expect(isAcceptedAnswer('Frankreich', paris, germanCatalog)).toBe(false)
    expect(isAcceptedAnswer('Eiffelturm', paris, germanCatalog)).toBe(false)
    expect(birmingham.place.country).toBe('Vereinigtes Königreich')
    expect(cities.some((city) => city.place.country === 'USA' && normalizeAnswer(city.name) === 'birmingham')).toBe(false)
    expect(isAcceptedAnswer('Birmingham', birmingham, germanCatalog)).toBe(true)
  })
})
