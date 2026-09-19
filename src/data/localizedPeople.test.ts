import { describe, expect, it } from 'vitest'
import { people } from './people'
import { englishPersonTranslations } from './peopleTranslations.en'
import { localizePerson } from './localizedPeople'
import { isAcceptedAnswer } from '../domain/answerMatcher'

describe('bilingualer Personenkatalog', () => {
  it('enthält für jede Person vollständige englische Inhalte', () => {
    expect(Object.keys(englishPersonTranslations)).toHaveLength(people.length)
    for (const person of people) {
      const translation = englishPersonTranslations[person.id]
      expect(translation, person.id).toBeDefined()
      expect(translation.hints).toHaveLength(3)
      expect(translation.summary).not.toBe(person.summary)
    }
  })

  it('übersetzt Texte, aber verändert Identität und Koordinaten nicht', () => {
    const german = people.find((person) => person.id === 'albert-einstein')!
    const english = localizePerson(german, 'en')

    expect(english.category).toBe('Physics')
    expect(english.birth.country).toBe('Germany')
    expect(english.birth.coordinates).toEqual(german.birth.coordinates)
    expect(english.wikidataId).toBe(german.wikidataId)
    expect(localizePerson(german, 'de')).toBe(german)
  })

  it('nutzt als zweiten Hinweis ein Werk oder eine Leistung statt Epoche und Region', () => {
    const eraPattern = /Jahrhundert|century|Barock|Renaissance|Zeitenwende|turn of the era|\bum \d{3,4}\b|\baround \d{3,4}\b|\bim \d+\. |\bin the \d|early \d|frühen \d/i
    for (const person of people) {
      const english = localizePerson(person, 'en')
      expect(person.hints[1], person.id).not.toMatch(eraPattern)
      expect(english.hints[1], person.id).not.toMatch(eraPattern)
      expect(person.hints[1]).not.toBe(person.hints[0])
      expect(person.hints[1]).not.toBe(person.hints[2])
      expect(english.hints[1]).not.toBe(english.hints[0])
      expect(english.hints[1]).not.toBe(english.hints[2])
    }
  })

  it('uses established English names and keeps the German name as an answer alias', () => {
    const german = people.find((person) => person.wikidataId === 'Q36450')!
    const english = localizePerson(german, 'en')

    expect(english.name).toBe('Catherine the Great')
    expect(english.aliases).toContain('Katharina die Große')
    const englishCatalog = people.map((person) => localizePerson(person, 'en'))
    expect(isAcceptedAnswer('Catherine the Great', english, englishCatalog)).toBe(true)
    expect(isAcceptedAnswer('Katharina die Große', english, englishCatalog)).toBe(true)
  })
})
