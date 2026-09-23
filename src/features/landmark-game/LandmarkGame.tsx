import { useReducer, useState } from 'react'
import { LocationMap } from '../../components/LocationMap'
import { landmarks } from '../../data/landmarks'
import { localizeLandmark } from '../../data/localizedLandmarks'
import {
  createGame,
  gameReducer,
  selectSession,
  STAGE_POINTS,
} from '../person-game/gameEngine'
import { getLandmarkBestScore, saveLandmarkBestScore } from './storage'
import { LanguageSwitch, useLanguage } from '../../i18n'

interface LandmarkGameProps {
  onExit: () => void
}

export function LandmarkGame({ onExit }: LandmarkGameProps) {
  const { copy, language } = useLanguage()
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => createGame(selectSession(landmarks)),
  )
  const [answer, setAnswer] = useState('')
  const [bestScore, setBestScore] = useState(getLandmarkBestScore)
  const canonical = state.people[state.roundIndex]
  const landmark = localizeLandmark(canonical, language)

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
      catalog: landmarks.map((entry) => localizeLandmark(entry, language)),
    })
    setAnswer('')
  }

  const newSession = () => {
    dispatch({ type: 'RESET', people: selectSession(landmarks) })
    setAnswer('')
  }

  const nextRound = () => {
    if (state.roundIndex === 9) setBestScore(saveLandmarkBestScore(state.totalScore))
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
          {copy.landmarkRecognised(state.results.filter((result) => result.solved).length)}
          {' · '}{copy.bestScore(bestScore)}
        </p>
        <div className="result-list">
          {state.results.map((result, index) => {
            const resultLandmark = state.people.find((entry) => entry.id === result.personId)
            const display = resultLandmark ? localizeLandmark(resultLandmark, language) : undefined
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
            <img
              className="landmark-photo"
              src={landmark.image.url}
              alt={copy.landmarkPhotoAlt}
            />
          ) : (
            <LocationMap coordinates={landmark.place.coordinates} label={landmark.name} />
          )}
        </div>

        <aside className="guess-panel">
          {state.status === 'playing' ? (
            <>
              <p className="eyebrow">{copy.landmarkWho}</p>
              <h1>{copy.landmarkPrompt}</h1>
              <div className="score-track" aria-label={`${STAGE_POINTS[state.stage]} ${copy.pointsShort}`}>
                {STAGE_POINTS.map((points, index) => (
                  <span key={points} className={index === state.stage ? 'active' : index < state.stage ? 'used' : ''}>
                    {points}
                  </span>
                ))}
              </div>
              <div className="hint-list" aria-live="polite">
                {landmark.hints.map((hint, index) => (
                  <div className={`hint ${index < state.stage ? 'hint--visible' : ''}`} key={hint}>
                    <span>{index + 1}</span>
                    <p>{index < state.stage ? hint : copy.hidden}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={submit} className="answer-form">
                <label htmlFor="landmark-answer">{copy.landmarkAnswerLabel}</label>
                <div>
                  <input
                    id="landmark-answer"
                    autoComplete="off"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder={copy.answerPlaceholder}
                  />
                  <button className="primary-button" type="submit">{copy.check}</button>
                </div>
              </form>
              <button className="secondary-button hint-button" onClick={() => dispatch({ type: 'HINT' })}>
                {state.stage < 3 ? copy.revealHint(state.stage + 1) : copy.landmarkReveal}
              </button>
              {feedbackText && <p className="feedback" role="status">{feedbackText}</p>}
            </>
          ) : (
            <div className="reveal-panel">
              <p className="eyebrow">{state.results.at(-1)?.solved ? copy.correctlyIdentified : copy.landmarkMystery}</p>
              <div className="identity">
                <img className="portrait" src={landmark.image.url} alt={landmark.name} />
                <div>
                  <h1>{landmark.name}</h1>
                  <p>{landmark.place.name}, {landmark.place.country}</p>
                </div>
              </div>
              <p className="summary">{landmark.summary}</p>
              <div className="sources">
                <span>{copy.sources}</span>
                {landmark.sources.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>
                ))}
                <a href={landmark.image.pageUrl} target="_blank" rel="noreferrer">
                  {copy.imageCredit}: {landmark.image.creator}, {landmark.image.license} ↗
                </a>
              </div>
              <button className="primary-button next-button" onClick={nextRound}>
                {state.roundIndex === 9 ? copy.showResults : copy.landmarkNext}
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}
