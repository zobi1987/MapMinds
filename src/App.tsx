import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import { hasSeenIntro, markIntroSeen } from './features/person-game/storage'
import { hasSeenLandmarkIntro, markLandmarkIntroSeen } from './features/landmark-game/storage'
import { LanguageSwitch, useLanguage } from './i18n'

const PersonGame = lazy(() => import('./features/person-game/PersonGame')
  .then((module) => ({ default: module.PersonGame })))
const LandmarkGame = lazy(() => import('./features/landmark-game/LandmarkGame')
  .then((module) => ({ default: module.LandmarkGame })))

function App() {
  const { copy } = useLanguage()
  const [view, setView] = useState<'hub' | 'intro' | 'game' | 'landmark-intro' | 'landmark'>('hub')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  if (view === 'landmark') {
    return (
      <Suspense fallback={<div className="loading-screen">{copy.loading}</div>}>
        <LandmarkGame onExit={() => setView('hub')} />
      </Suspense>
    )
  }

  if (view === 'landmark-intro') {
    return (
      <main className="intro-screen">
        <div className="intro-toolbar">
          <button className="text-button back-button" onClick={() => setView('hub')}>← {copy.back}</button>
          <LanguageSwitch />
        </div>
        <p className="brand-mark">MM</p>
        <p className="eyebrow">{copy.howItWorks}</p>
        <h1>{copy.landmarkIntroTitle}</h1>
        <div className="intro-steps">
          <article><span>01</span><h2>{copy.landmarkPhotoTitle}</h2><p>{copy.landmarkPhotoText}</p></article>
          <article><span>02</span><h2>{copy.landmarkGuessTitle}</h2><p>{copy.landmarkGuessText}</p></article>
          <article><span>03</span><h2>{copy.hintsTitle}</h2><p>{copy.hintsText}</p></article>
        </div>
        <button
          className="primary-button intro-start"
          onClick={() => {
            markLandmarkIntroSeen()
            setView('landmark')
          }}
        >
          {copy.firstSession}
        </button>
      </main>
    )
  }

  if (view === 'game') {
    return (
      <Suspense fallback={<div className="loading-screen">{copy.loading}</div>}>
        <PersonGame onExit={() => setView('hub')} />
      </Suspense>
    )
  }

  if (view === 'intro') {
    return (
      <main className="intro-screen">
        <div className="intro-toolbar">
          <button className="text-button back-button" onClick={() => setView('hub')}>← {copy.back}</button>
          <LanguageSwitch />
        </div>
        <p className="brand-mark">MM</p>
        <p className="eyebrow">{copy.howItWorks}</p>
        <h1>{copy.introTitle}</h1>
        <div className="intro-steps">
          <article><span>01</span><h2>{copy.placesTitle}</h2><p>{copy.placesText}</p></article>
          <article><span>02</span><h2>{copy.guessTitle}</h2><p>{copy.guessText}</p></article>
          <article><span>03</span><h2>{copy.hintsTitle}</h2><p>{copy.hintsText}</p></article>
        </div>
        <button
          className="primary-button intro-start"
          onClick={() => {
            markIntroSeen()
            setView('game')
          }}
        >
          {copy.firstSession}
        </button>
      </main>
    )
  }

  const startPeopleGame = () => setView(hasSeenIntro() ? 'game' : 'intro')
  const startLandmarkGame = () => setView(hasSeenLandmarkIntro() ? 'landmark' : 'landmark-intro')

  return (
    <main className="hub">
      <nav className="site-nav">
        <a className="brand" href="./"><span>MM</span> MapMinds</a>
        <div className="nav-actions">
          <span className="nav-note">{copy.tagline}</span>
          <LanguageSwitch />
        </div>
      </nav>
      <header className="hub-hero">
        <p className="eyebrow">{copy.hubEyebrow}</p>
        <h1>{copy.hubTitle}<br /><em>{copy.hubTitleAccent}</em></h1>
        <p>{copy.hubLead}</p>
      </header>
      <section className="game-cards" aria-label="Spiele">
        <article className="game-card game-card--active">
          <div className="card-map-art" aria-hidden="true">
            <i className="route-line" />
            <span className="art-pin art-pin--one" />
            <span className="art-pin art-pin--two" />
            <strong>1879</strong><strong>1955</strong>
          </div>
          <div className="card-copy">
            <p className="eyebrow">{copy.playable}</p>
            <h2>{copy.lifeLines}</h2>
            <p>{copy.lifeLinesDescription}</p>
            <div><span>{copy.rounds}</span><span>{copy.people}</span></div>
            <button className="primary-button" onClick={startPeopleGame}>{copy.startGame} <b>→</b></button>
          </div>
        </article>
        <article className="game-card game-card--active">
          <div className="card-map-art landmark-card-art" aria-hidden="true">
            <span className="art-pin art-pin--one" />
          </div>
          <div className="card-copy">
            <p className="eyebrow">{copy.playable}</p>
            <h2>{copy.landmarks}</h2>
            <p>{copy.landmarksDescription}</p>
            <div><span>{copy.rounds}</span><span>{copy.landmarkCount}</span></div>
            <button className="primary-button" onClick={startLandmarkGame}>{copy.landmarkStart} <b>→</b></button>
          </div>
        </article>
        <article className="game-card game-card--planned">
          <div className="planned-art city-art" aria-hidden="true">⌘</div>
          <div className="card-copy">
            <p className="eyebrow">{copy.planned}</p>
            <h2>{copy.cities}</h2>
            <p>{copy.citiesDescription}</p>
          </div>
        </article>
        <article className="game-card game-card--planned">
          <div className="planned-art journey-art" aria-hidden="true">⌁</div>
          <div className="card-copy">
            <p className="eyebrow">{copy.planned}</p>
            <h2>{copy.journeys}</h2>
            <p>{copy.journeysDescription}</p>
          </div>
        </article>
      </section>
      <footer><span>MapMinds</span><p>{copy.footer}</p></footer>
    </main>
  )
}

export default App
