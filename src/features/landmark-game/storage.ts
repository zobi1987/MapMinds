const BEST_SCORE_KEY = 'mapminds.landmark.bestScore'
const INTRO_KEY = 'mapminds.landmark.introSeen'

function readNumber(key: string): number {
  if (typeof window === 'undefined') return 0
  const value = Number(window.localStorage.getItem(key))
  return Number.isFinite(value) ? value : 0
}

export function getLandmarkBestScore(): number {
  return readNumber(BEST_SCORE_KEY)
}

export function saveLandmarkBestScore(score: number): number {
  const best = Math.max(getLandmarkBestScore(), score)
  window.localStorage.setItem(BEST_SCORE_KEY, String(best))
  return best
}

export function hasSeenLandmarkIntro(): boolean {
  return typeof window !== 'undefined'
    && window.localStorage.getItem(INTRO_KEY) === 'true'
}

export function markLandmarkIntroSeen(): void {
  window.localStorage.setItem(INTRO_KEY, 'true')
}
