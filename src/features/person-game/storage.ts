const BEST_SCORE_KEY = 'mapminds.bestScore'
const INTRO_KEY = 'mapminds.introSeen'

function readNumber(key: string): number {
  if (typeof window === 'undefined') return 0
  const value = Number(window.localStorage.getItem(key))
  return Number.isFinite(value) ? value : 0
}

export function getBestScore(): number {
  return readNumber(BEST_SCORE_KEY)
}

export function saveBestScore(score: number): number {
  const best = Math.max(getBestScore(), score)
  window.localStorage.setItem(BEST_SCORE_KEY, String(best))
  return best
}

export function hasSeenIntro(): boolean {
  return typeof window !== 'undefined'
    && window.localStorage.getItem(INTRO_KEY) === 'true'
}

export function markIntroSeen(): void {
  window.localStorage.setItem(INTRO_KEY, 'true')
}
