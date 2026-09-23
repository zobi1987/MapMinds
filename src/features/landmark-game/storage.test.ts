import { beforeEach, describe, expect, it } from 'vitest'
import {
  getLandmarkBestScore,
  hasSeenLandmarkIntro,
  markLandmarkIntroSeen,
  saveLandmarkBestScore,
} from './storage'

describe('Wahrzeichen-Speicher', () => {
  beforeEach(() => window.localStorage.clear())

  it('behält den höheren Bestwert', () => {
    expect(saveLandmarkBestScore(4200)).toBe(4200)
    expect(saveLandmarkBestScore(2500)).toBe(4200)
    expect(getLandmarkBestScore()).toBe(4200)
  })

  it('ignoriert einen unlesbaren Bestwert', () => {
    window.localStorage.setItem('mapminds.landmark.bestScore', 'kein Wert')
    expect(getLandmarkBestScore()).toBe(0)
    expect(saveLandmarkBestScore(100)).toBe(100)
  })

  it('merkt sich die Einführung', () => {
    expect(hasSeenLandmarkIntro()).toBe(false)
    markLandmarkIntroSeen()
    expect(hasSeenLandmarkIntro()).toBe(true)
  })
})
