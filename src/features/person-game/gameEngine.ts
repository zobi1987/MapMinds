import type { Answerable } from '../../domain/answerMatcher'
import { isAcceptedAnswer } from '../../domain/answerMatcher'
import type { Difficulty } from '../../domain/personSchema'

export interface SessionEntry extends Answerable {
  id: string
  difficulty: Difficulty
}

export const STAGE_POINTS = [1000, 700, 400, 100] as const

export type GameStatus = 'playing' | 'revealed' | 'complete'

export interface RoundResult {
  personId: string
  score: number
  solved: boolean
}

export type GameFeedback =
  | { type: 'correct' }
  | { type: 'unresolved' }
  | { type: 'hintRevealed'; hintNumber: number }
  | { type: 'wrongHint'; hintNumber: number }

export interface GameState<T extends SessionEntry = SessionEntry> {
  people: T[]
  roundIndex: number
  stage: number
  status: GameStatus
  totalScore: number
  feedback: GameFeedback | null
  results: RoundResult[]
}

export type GameAction<T extends SessionEntry = SessionEntry> =
  | { type: 'SUBMIT'; answer: string; catalog: T[] }
  | { type: 'HINT' }
  | { type: 'NEXT' }
  | { type: 'RESET'; people: T[] }

function shuffle<T>(values: T[], random: () => number): T[] {
  return [...values].sort(() => random() - 0.5)
}

export function selectSession<T extends SessionEntry>(
  catalog: T[],
  random: () => number = Math.random,
): T[] {
  const targets: Record<Difficulty, number> = { easy: 4, medium: 4, hard: 2 }
  const picked = (Object.keys(targets) as Difficulty[]).flatMap((difficulty) =>
    shuffle(catalog.filter((person) => person.difficulty === difficulty), random)
      .slice(0, targets[difficulty]),
  )

  if (picked.length < 10) {
    const selectedIds = new Set(picked.map((person) => person.id))
    picked.push(...shuffle(
      catalog.filter((person) => !selectedIds.has(person.id)),
      random,
    ).slice(0, 10 - picked.length))
  }

  return shuffle(picked, random)
}

export function createGame<T extends SessionEntry>(people: T[]): GameState<T> {
  if (people.length !== 10) {
    throw new Error('Eine Session benötigt genau zehn Personen.')
  }
  if (new Set(people.map((person) => person.id)).size !== people.length) {
    throw new Error('Eine Session benötigt zehn unterschiedliche Personen.')
  }
  return {
    people,
    roundIndex: 0,
    stage: 0,
    status: 'playing',
    totalScore: 0,
    feedback: null,
    results: [],
  }
}

function reveal<T extends SessionEntry>(state: GameState<T>, score: number, solved: boolean): GameState<T> {
  const person = state.people[state.roundIndex]
  return {
    ...state,
    status: 'revealed',
    totalScore: state.totalScore + score,
    feedback: { type: solved ? 'correct' : 'unresolved' },
    results: [...state.results, { personId: person.id, score, solved }],
  }
}

export function gameReducer<T extends SessionEntry>(state: GameState<T>, action: GameAction<T>): GameState<T> {
  if (action.type === 'RESET') return createGame(action.people)

  if (action.type === 'NEXT') {
    if (state.status !== 'revealed') return state
    if (state.roundIndex === state.people.length - 1) {
      return { ...state, status: 'complete', feedback: null }
    }
    return {
      ...state,
      roundIndex: state.roundIndex + 1,
      stage: 0,
      status: 'playing',
      feedback: null,
    }
  }

  if (state.status !== 'playing') return state

  if (action.type === 'HINT') {
    if (state.stage === 3) return reveal(state, 0, false)
    return {
      ...state,
      stage: state.stage + 1,
      feedback: { type: 'hintRevealed', hintNumber: state.stage + 1 },
    }
  }

  const person = state.people[state.roundIndex]
  const answerPerson = action.catalog.find((candidate) => candidate.id === person.id) ?? person
  if (isAcceptedAnswer(action.answer, answerPerson, action.catalog)) {
    return reveal(state, STAGE_POINTS[state.stage], true)
  }
  if (state.stage === 3) return reveal(state, 0, false)

  return {
    ...state,
    stage: state.stage + 1,
    feedback: { type: 'wrongHint', hintNumber: state.stage + 1 },
  }
}
