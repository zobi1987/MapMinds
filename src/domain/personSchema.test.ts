import { describe, expect, it } from 'vitest'
import { people } from '../data/people'
import { validateCatalog } from './personSchema'

describe('Personenkatalog', () => {
  it('liefert 200 vollständig spielbare und belegte Personen aus', () => {
    expect(people).toHaveLength(200)
    expect(people.every((person) => person.hints.length === 3)).toBe(true)
    expect(people.every((person) => person.sources.length > 0)).toBe(true)
    expect(people.every((person) => person.portrait?.url.startsWith('https://'))).toBe(true)
    expect(people.every((person) => person.portrait?.pageUrl.startsWith('https://'))).toBe(true)
    expect(people.every((person) => person.portrait?.creator && person.portrait.license)).toBe(true)
  })

  it('weist dieselbe Wikidata-Quelle bei zwei Personen zurück', () => {
    const duplicateSource = {
      ...people[1],
      id: 'andere-person',
      name: 'Andere Person',
      wikidataId: people[0].wikidataId,
    }

    expect(() => validateCatalog([
      people[0],
      duplicateSource,
      ...people.slice(2, 10),
    ])).toThrow(/Wikidata-ID/)
  })

  it('weist unsichere HTTP-Porträts für das HTTPS-Deployment zurück', () => {
    const insecurePortrait = {
      ...people[0],
      portrait: {
        ...people[0].portrait!,
        url: 'http://example.com/portrait.jpg',
      },
    }

    expect(() => validateCatalog([
      insecurePortrait,
      ...people.slice(1, 10),
    ])).toThrow()
  })
})
