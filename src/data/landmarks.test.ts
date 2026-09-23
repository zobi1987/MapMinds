import { describe, expect, it } from 'vitest'
import { landmarks } from './landmarks'
import { localizeLandmark } from './localizedLandmarks'
import { isAcceptedAnswer } from '../domain/answerMatcher'
import { normalizeAnswer } from '../domain/answerMatcher'

const contains = (value: string, banned: string) => {
  const haystack = normalizeAnswer(value)
  const needle = normalizeAnswer(banned)
  return needle.length >= 4 && haystack.includes(needle)
}

describe('Wahrzeichenkatalog', () => {
  it('enthält 100 Luftbilder mit ausgewogener Schwierigkeit', () => {
    expect(landmarks).toHaveLength(100)
    expect(landmarks.filter((landmark) => landmark.difficulty === 'easy').length).toBeGreaterThanOrEqual(4)
    expect(landmarks.filter((landmark) => landmark.difficulty === 'medium').length).toBeGreaterThanOrEqual(4)
    expect(landmarks.filter((landmark) => landmark.difficulty === 'hard').length).toBeGreaterThanOrEqual(2)
    expect(landmarks.every((landmark) => landmark.image.url.startsWith('https://'))).toBe(true)
  })

  it('nennt im Hinweis weder den Namen noch das Land', () => {
    for (const landmark of landmarks) {
      const english = localizeLandmark(landmark, 'en')
      const banned = [landmark.name, landmark.place.country, english.name, english.place.country]
      for (const hint of [...landmark.hints, ...english.hints]) {
        for (const term of banned) {
          expect(contains(hint, term), `${landmark.id}: ${hint}`).toBe(false)
        }
      }
    }
  })

  it('zeigt Tikal erkennbar und trennt die Blaue Moschee von der Hagia Sophia', () => {
    const tikal = landmarks.find((landmark) => landmark.wikidataId === 'Q181172')!
    const blue = landmarks.find((landmark) => landmark.wikidataId === 'Q80541')!
    const hagia = landmarks.find((landmark) => landmark.wikidataId === 'Q12506')!
    const germanCatalog = landmarks
    const englishCatalog = landmarks.map((landmark) => localizeLandmark(landmark, 'en'))

    expect(tikal.image.pageUrl).toContain('The-temple-of-the-jaguar')
    expect(blue.image.pageUrl).toContain('8396648956')
    expect(hagia.image.pageUrl).toContain('Hagia_Sophia_Mars_2013')
    expect(blue.image.pageUrl).not.toBe(hagia.image.pageUrl)

    expect(isAcceptedAnswer('Blaue Moschee', blue, germanCatalog)).toBe(true)
    expect(isAcceptedAnswer('Sultan Ahmed', blue, germanCatalog)).toBe(true)
    expect(isAcceptedAnswer('Sultanahmet', blue, germanCatalog)).toBe(true)
    expect(isAcceptedAnswer('Blue Mosque', localizeLandmark(blue, 'en'), englishCatalog)).toBe(true)
    expect(isAcceptedAnswer('Hagia Sophia', blue, germanCatalog)).toBe(false)
    expect(isAcceptedAnswer('Hagia Sophia', hagia, germanCatalog)).toBe(true)
    expect(isAcceptedAnswer('Aya Sofya', hagia, germanCatalog)).toBe(true)
    expect(isAcceptedAnswer('Blaue Moschee', hagia, germanCatalog)).toBe(false)
  })

  it('zählt den Bauwerksnamen und nicht die Stadt', () => {
    const eiffel = landmarks.find((landmark) => landmark.wikidataId === 'Q243')!
    const english = localizeLandmark(eiffel, 'en')
    const germanCatalog = landmarks
    const englishCatalog = landmarks.map((landmark) => localizeLandmark(landmark, 'en'))

    expect(isAcceptedAnswer('Eiffelturm', eiffel, germanCatalog)).toBe(true)
    expect(isAcceptedAnswer('Eiffel Tower', english, englishCatalog)).toBe(true)
    expect(isAcceptedAnswer('Paris', eiffel, germanCatalog)).toBe(false)
    expect(isAcceptedAnswer('Frankreich', eiffel, germanCatalog)).toBe(false)
  })
})
