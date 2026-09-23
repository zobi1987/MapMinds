import { beforeEach, describe, expect, it } from 'vitest'
import {
  getCityBestScore,
  hasSeenCityIntro,
  markCityIntroSeen,
  saveCityBestScore,
} from './storage'

describe('Städte-Speicher', () => {
  beforeEach(() => window.localStorage.clear())

  it('behält den höheren Bestwert', () => {
    expect(saveCityBestScore(4200)).toBe(4200)
    expect(saveCityBestScore(2500)).toBe(4200)
    expect(getCityBestScore()).toBe(4200)
  })

  it('ignoriert einen unlesbaren Bestwert', () => {
    window.localStorage.setItem('mapminds.city.bestScore', 'kein Wert')
    expect(getCityBestScore()).toBe(0)
    expect(saveCityBestScore(100)).toBe(100)
  })

  it('merkt sich die Einführung', () => {
    expect(hasSeenCityIntro()).toBe(false)
    markCityIntroSeen()
    expect(hasSeenCityIntro()).toBe(true)
  })
})
