import { describe, expect, it } from 'vitest'
import { people } from '../data/people'
import { isAcceptedAnswer, normalizeAnswer } from './answerMatcher'

const einstein = people.find((person) => person.id === 'albert-einstein')!

describe('answerMatcher', () => {
  it('normalisiert Großschreibung, Akzente und Satzzeichen', () => {
    expect(normalizeAnswer('  Frédéric--Chopin! ')).toBe('frederic chopin')
  })

  it('behandelt ß und ss als gleichwertige deutsche Schreibweisen', () => {
    expect(normalizeAnswer('Johann Strauß')).toBe(normalizeAnswer('Johann Strauss'))
  })

  it('akzeptiert vollständigen Namen, eindeutigen Nachnamen und Tippfehler', () => {
    expect(isAcceptedAnswer('Albert Einstein', einstein, people)).toBe(true)
    expect(isAcceptedAnswer('Einstein', einstein, people)).toBe(true)
    expect(isAcceptedAnswer('Einstien', einstein, people)).toBe(true)
    expect(isAcceptedAnswer('Einsteim', einstein, people)).toBe(true)
  })

  it('weist deutlich falsche Antworten zurück', () => {
    expect(isAcceptedAnswer('Isaac Newton', einstein, people)).toBe(false)
    expect(isAcceptedAnswer('Al', einstein, people)).toBe(false)
  })

  it('akzeptiert einen Alias nicht, wenn er mehreren Personen gehört', () => {
    const commonAlias = 'Der Große'
    const first = { ...people[0], aliases: [commonAlias] }
    const second = { ...people[1], aliases: [commonAlias] }
    const ambiguousCatalog = [first, second, ...people.slice(2)]

    expect(isAcceptedAnswer(commonAlias, first, ambiguousCatalog)).toBe(false)
    expect(isAcceptedAnswer(first.name, first, ambiguousCatalog)).toBe(true)
  })

  it('verlangt den vollständigen Namen, wenn ein Nachname fremder Alias ist', () => {
    const other = { ...people[1], aliases: ['Einstein'] }
    const ambiguousCatalog = [einstein, other, ...people.slice(2)]

    expect(isAcceptedAnswer('Einstein', einstein, ambiguousCatalog)).toBe(false)
    expect(isAcceptedAnswer('Albert Einstein', einstein, ambiguousCatalog)).toBe(true)
  })
})
