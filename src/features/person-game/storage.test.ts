import { beforeEach, describe, expect, it } from 'vitest'
import { getBestScore, hasSeenIntro, markIntroSeen, saveBestScore } from './storage'

describe('local storage', () => {
  beforeEach(() => window.localStorage.clear())

  it('überschreibt einen Bestwert nicht mit einem kleineren Ergebnis', () => {
    expect(saveBestScore(4200)).toBe(4200)
    expect(saveBestScore(2500)).toBe(4200)
    expect(getBestScore()).toBe(4200)
  })

  it('merkt sich die Einführung', () => {
    expect(hasSeenIntro()).toBe(false)
    markIntroSeen()
    expect(hasSeenIntro()).toBe(true)
  })
})
