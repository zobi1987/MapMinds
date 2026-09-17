import { useReducer, useState } from 'react'
import { WorldMap } from '../../components/WorldMap'
import { people } from '../../data/people'
import {
  createGame,
  gameReducer,
  selectSession,
  STAGE_POINTS,
} from './gameEngine'
import { getBestScore, saveBestScore } from './storage'
import { LanguageSwitch, useLanguage } from '../../i18n'
import { localizePerson } from '../../data/localizedPeople'

interface PersonGameProps {
  onExit: () => void
}

const formatYear = (year: number, language: 'en' | 'de') =>
  year < 0 ? `${Math.abs(year)} ${language === 'de' ? 'v. Chr.' : 'BC'}` : String(year)

function PersonPortrait({ name, url, fallbackLabel }: { name: string; url?: string; fallbackLabel: string }) {
  if (url) return <img className="portrait" src={url} alt={`Porträt von ${name}`} />
  return (
    <div className="portrait portrait--placeholder" aria-label={fallbackLabel}>
      {name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
    </div>
  )
}

export function PersonGame({ onExit }: PersonGameProps) {
  const { copy, language } = useLanguage()
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => createGame(selectSession(people)),
  )
  const [answer, setAnswer] = useState('')
  const [bestScore, setBestScore] = useState(getBestScore)
  const canonicalPerson = state.people[state.roundIndex]
  const person = localizePerson(canonicalPerson, language)

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
      catalog: people.map((entry) => localizePerson(entry, language)),
    })
    setAnswer('')
  }

  const newSession = () => {
    dispatch({ type: 'RESET', people: selectSession(people) })
    setAnswer('')
  }

  const nextRound = () => {
    if (state.roundIndex === 9) setBestScore(saveBestScore(state.totalScore))
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
          {copy.recognised(state.results.filter((result) => result.solved).length)}
          {' · '}{copy.bestScore(bestScore)}
        </p>
        <div className="result-list">
          {state.results.map((result, index) => {
            const resultPerson = state.people.find((entry) => entry.id === result.personId)
            const displayPerson = resultPerson ? localizePerson(resultPerson, language) : undefined
            return (
              <div className="result-row" key={result.personId}>
                <span>{index + 1}</span>
                <strong>{displayPerson?.name}</strong>
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
          <WorldMap person={person} revealNames={state.status === 'revealed'} />
        </div>

        <aside className="guess-panel">
          {state.status === 'playing' ? (
            <>
              <p className="eyebrow">{copy.who}</p>
              <h1>{copy.twoPlaces}</h1>
              <div className="score-track" aria-label={`${STAGE_POINTS[state.stage]} ${copy.pointsShort}`}>
                {STAGE_POINTS.map((points, index) => (
                  <span key={points} className={index === state.stage ? 'active' : index < state.stage ? 'used' : ''}>
                    {points}
                  </span>
                ))}
              </div>

              <div className="hint-list" aria-live="polite">
                {person.hints.map((hint, index) => (
                  <div className={`hint ${index < state.stage ? 'hint--visible' : ''}`} key={hint}>
                    <span>{index + 1}</span>
                    <p>{index < state.stage ? hint : copy.hidden}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={submit} className="answer-form">
                <label htmlFor="answer">{copy.answerLabel}</label>
                <div>
                  <input
                    id="answer"
                    autoComplete="off"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder={copy.answerPlaceholder}
                    autoFocus
                  />
                  <button className="primary-button" type="submit">{copy.check}</button>
                </div>
              </form>
              <button className="secondary-button hint-button" onClick={() => dispatch({ type: 'HINT' })}>
                {state.stage < 3 ? copy.revealHint(state.stage + 1) : copy.revealPerson}
              </button>
              {feedbackText && <p className="feedback" role="status">{feedbackText}</p>}
            </>
          ) : (
            <div className="reveal-panel">
              <p className="eyebrow">{state.results.at(-1)?.solved ? copy.correctlyIdentified : copy.mysteryPerson}</p>
              <div className="identity">
                <PersonPortrait name={person.name} url={person.portrait?.url} fallbackLabel={copy.noPortrait(person.name)} />
                <div>
                  <h1>{person.name}</h1>
                  <p>{formatYear(person.birth.year, language)}–{formatYear(person.death.year, language)}</p>
                </div>
              </div>
              <p className="summary">{person.summary}</p>
              <dl className="places">
                <div><dt>{copy.born}</dt><dd>{person.birth.name}, {person.birth.country} · {formatYear(person.birth.year, language)}</dd></div>
                <div><dt>{copy.died}</dt><dd>{person.death.name}, {person.death.country} · {formatYear(person.death.year, language)}</dd></div>
              </dl>
              <div className="sources">
                <span>{copy.sources}</span>
                {person.sources.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>
                ))}
                {person.portrait && (
                  <a href={person.portrait.pageUrl} target="_blank" rel="noreferrer">
                    {copy.imageCredit}: {person.portrait.creator}, {person.portrait.license} ↗
                  </a>
                )}
              </div>
              <button className="primary-button next-button" onClick={nextRound}>
                {state.roundIndex === 9 ? copy.showResults : copy.nextPerson}
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}
