const BEST_SCORE_KEY = 'mapminds.city.bestScore'
const INTRO_KEY = 'mapminds.city.introSeen'

function readNumber(key: string): number {
  if (typeof window === 'undefined') return 0
  const value = Number(window.localStorage.getItem(key))
  return Number.isFinite(value) ? value : 0
}

export function getCityBestScore(): number {
  return readNumber(BEST_SCORE_KEY)
}

export function saveCityBestScore(score: number): number {
  const best = Math.max(getCityBestScore(), score)
  window.localStorage.setItem(BEST_SCORE_KEY, String(best))
  return best
}

export function hasSeenCityIntro(): boolean {
  return typeof window !== 'undefined'
    && window.localStorage.getItem(INTRO_KEY) === 'true'
}

export function markCityIntroSeen(): void {
  window.localStorage.setItem(INTRO_KEY, 'true')
}
