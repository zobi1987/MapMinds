import { useEffect, useReducer, useRef, useState } from 'react'
import { LocationMap } from '../../components/LocationMap'
import { cities } from '../../data/cities'
import { localizeCity } from '../../data/localizedCities'
import {
  createGame,
  gameReducer,
  selectSession,
  STAGE_POINTS,
} from '../person-game/gameEngine'
import { getCityBestScore, saveCityBestScore } from './storage'
import { LanguageSwitch, useLanguage } from '../../i18n'

interface CityGameProps {
  onExit: () => void
}

function ZoomablePhoto({ src, alt }: { src: string; alt: string }) {
  const { copy } = useLanguage()
  const frameRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const setClampedZoom = (next: number) => setZoom(Math.min(4, Math.max(1, next)))

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return undefined
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const factor = event.deltaY < 0 ? 1.25 : 1 / 1.25
      setZoom((current) => Math.min(4, Math.max(1, current * factor)))
    }
    frame.addEventListener('wheel', onWheel, { passive: false })
    return () => frame.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <div className="landmark-photo-frame" ref={frameRef}>
      <img className="landmark-photo" src={src} alt={alt} style={{ transform: `scale(${zoom})` }} />
      <div className="landmark-zoom">
        <button type="button" aria-label={copy.zoomIn} onClick={() => setClampedZoom(zoom * 1.5)}>+</button>
        <button type="button" aria-label={copy.zoomOut} onClick={() => setClampedZoom(zoom / 1.5)}>−</button>
      </div>
    </div>
  )
}

export function CityGame({ onExit }: CityGameProps) {
  const { copy, language } = useLanguage()
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => createGame(selectSession(cities)),
  )
  const [answer, setAnswer] = useState('')
  const [bestScore, setBestScore] = useState(getCityBestScore)
  const canonical = state.people[state.roundIndex]
  const city = localizeCity(canonical, language)

  const feedbackText = state.feedback
    ? {
        correct: () => copy.correct,
        unresolved: () => copy.unresolved,
        hintRevealed: () => copy.hintRevealed(
          state.feedback?.type === 'hintRevealed' ? state.feedback.hintNumber : 0),
        wrongHint: () => copy.wrongHint(
          state.feedback?.type === 'wrongHint' ? state.feedback.hintNumber : 0),
      }[state.feedback.type]()
    : null

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!answer.trim()) return
    dispatch({
      type: 'SUBMIT',
      answer,
      catalog: cities.map((entry) => localizeCity(entry, language)),
    })
    setAnswer('')
  }

  const newSession = () => {
    dispatch({ type: 'RESET', people: selectSession(cities) })
    setAnswer('')
  }

  const nextRound = () => {
    if (state.roundIndex === 9) setBestScore(saveCityBestScore(state.totalScore))
    dispatch({ type: 'NEXT' })
  }

  if (state.status === 'complete') {
    return (
      <main className="game-shell results-screen">
        <div className="results-toolbar">
          <button className="text-button back-button" onClick={onExit}>← {copy.otherGames}</button>
          <LanguageSwitch />
        </div>
        <p className="eyebrow">{copy.sessionComplete}</p>
        <h1>{state.totalScore.toLocaleString(language)} {copy.pointsShort}</h1>
        <p className="result-lead">
          {copy.cityRecognised(state.results.filter((result) => result.solved).length)}
          {' · '}{copy.bestScore(bestScore)}
        </p>
        <div className="result-list">
          {state.results.map((result, index) => {
            const resultCity = state.people.find((entry) => entry.id === result.personId)
            const display = resultCity ? localizeCity(resultCity, language) : undefined
            return (
              <div className="result-row" key={result.personId}>
                <span>{index + 1}</span>
                <strong>{display?.name}</strong>
                <span className={result.solved ? 'result-ok' : 'result-miss'}>
                  {result.solved ? `${result.score} ${copy.pointsShort}` : copy.notSolved}
                </span>
              </div>
            )
          })}
        </div>
        <div className="button-row">
          <button className="primary-button" onClick={newSession}>{copy.newSession}</button>
          <button className="secondary-button" onClick={onExit}>{copy.otherGames}</button>
        </div>
      </main>
    )
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <button className="text-button" onClick={onExit}>← {copy.hub}</button>
        <div className="round-progress" aria-label={copy.round(state.roundIndex + 1)}>
          <span>{copy.round(state.roundIndex + 1)}</span>
          <div><i style={{ width: `${(state.roundIndex + 1) * 10}%` }} /></div>
        </div>
        <div className="game-header-actions">
          <strong>{state.totalScore.toLocaleString(language)} {copy.pointsShort}</strong>
          <LanguageSwitch />
        </div>
      </header>

      <section className="game-grid">
        <div className="map-column">
          {state.status === 'playing' ? (
            <ZoomablePhoto src={city.image.url} alt={copy.cityPhotoAlt} />
          ) : (
            <LocationMap coordinates={city.place.coordinates} label={city.name} mapLabel={copy.cityMapLabel} />
          )}
        </div>

        <aside className="guess-panel">
          {state.status === 'playing' ? (
            <>
              <p className="eyebrow">{copy.cityWho}</p>
              <h1>{copy.cityPrompt}</h1>
              <div className="score-track" aria-label={`${STAGE_POINTS[state.stage]} ${copy.pointsShort}`}>
                {STAGE_POINTS.map((points, index) => (
                  <span key={points} className={index === state.stage ? 'active' : index < state.stage ? 'used' : ''}>
                    {points}
                  </span>
                ))}
              </div>
              <div className="hint-list" aria-live="polite">
                {city.hints.map((hint, index) => (
                  <div className={`hint ${index < state.stage ? 'hint--visible' : ''}`} key={hint}>
                    <span>{index + 1}</span>
                    <p>{index < state.stage ? hint : copy.hidden}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={submit} className="answer-form">
                <label htmlFor="city-answer">{copy.cityAnswerLabel}</label>
                <div>
                  <input
                    id="city-answer"
                    autoComplete="off"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder={copy.answerPlaceholder}
                  />
                  <button className="primary-button" type="submit">{copy.check}</button>
                </div>
              </form>
              <button className="secondary-button hint-button" onClick={() => dispatch({ type: 'HINT' })}>
                {state.stage < 3 ? copy.revealHint(state.stage + 1) : copy.cityReveal}
              </button>
              {feedbackText && <p className="feedback" role="status">{feedbackText}</p>}
            </>
          ) : (
            <div className="reveal-panel">
              <p className="eyebrow">{state.results.at(-1)?.solved ? copy.correctlyIdentified : copy.cityMystery}</p>
              <div className="identity">
                <img className="portrait" src={city.image.url} alt={city.name} />
                <div>
                  <h1>{city.name}</h1>
                  <p>{city.place.name}, {city.place.country}</p>
                </div>
              </div>
              <p className="summary">{city.summary}</p>
              <div className="sources">
                <span>{copy.sources}</span>
                {city.sources.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>
                ))}
                <a href={city.image.pageUrl} target="_blank" rel="noreferrer">
                  {copy.imageCredit}: {city.image.creator}, {city.image.license} ↗
                </a>
              </div>
              <button className="primary-button next-button" onClick={nextRound}>
                {state.roundIndex === 9 ? copy.showResults : copy.cityNext}
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}
