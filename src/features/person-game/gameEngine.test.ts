import { describe, expect, it } from 'vitest'
import { people } from '../../data/people'
import { createGame, gameReducer, selectSession } from './gameEngine'

describe('gameEngine', () => {
  it('startet keine Session mit doppelt vorkommenden Personen', () => {
    expect(() => createGame(Array(10).fill(people[0]))).toThrow(/unterschiedliche/)
  })

  it('stellt zehn Personen mit ausgewogenen Schwierigkeiten zusammen', () => {
    const session = selectSession(people, () => 0.42)
    expect(session).toHaveLength(10)
    expect(new Set(session.map((person) => person.id)).size).toBe(10)
    expect(session.filter((person) => person.difficulty === 'easy')).toHaveLength(4)
    expect(session.filter((person) => person.difficulty === 'medium')).toHaveLength(4)
    expect(session.filter((person) => person.difficulty === 'hard')).toHaveLength(2)
  })

  it('senkt nach falscher Antwort die erreichbaren Punkte', () => {
    const state = createGame(selectSession(people))
    const next = gameReducer(state, { type: 'SUBMIT', answer: 'völlig falsch', catalog: people })
    expect(next.stage).toBe(1)
    expect(next.status).toBe('playing')
  })

  it('vergibt die Punkte der aktuellen Stufe und beendet nach der Auflösung die Runde', () => {
    const initial = createGame(selectSession(people))
    const hinted = gameReducer(initial, { type: 'HINT' })
    const solved = gameReducer(hinted, {
      type: 'SUBMIT',
      answer: hinted.people[0].name,
      catalog: people,
    })
    expect(solved.status).toBe('revealed')
    expect(solved.totalScore).toBe(700)
    expect(solved.results[0].solved).toBe(true)
  })

  it('löst nach dem vierten Fehlversuch ohne Punkte auf', () => {
    let state = createGame(selectSession(people))
    for (let attempt = 0; attempt < 4; attempt += 1) {
      state = gameReducer(state, { type: 'SUBMIT', answer: 'unbekannt', catalog: people })
    }
    expect(state.status).toBe('revealed')
    expect(state.results[0].score).toBe(0)
  })

  it('wechselt nur nach einer Auflösung zur nächsten Runde und setzt die Hinweisstufe zurück', () => {
    const initial = createGame(selectSession(people))
    expect(gameReducer(initial, { type: 'NEXT' })).toBe(initial)

    const solved = gameReducer(initial, {
      type: 'SUBMIT',
      answer: initial.people[0].name,
      catalog: people,
    })
    const next = gameReducer(solved, { type: 'NEXT' })

    expect(next.roundIndex).toBe(1)
    expect(next.stage).toBe(0)
    expect(next.status).toBe('playing')
    expect(next.totalScore).toBe(1000)
  })
})
