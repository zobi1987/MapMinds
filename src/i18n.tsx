/* oxlint-disable react/only-export-components -- language context and switch share one public module */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'en' | 'de'

const LANGUAGE_KEY = 'mapminds.language'

const ui = {
  en: {
    tagline: 'Rediscover geography',
    hubEyebrow: 'Four games · One world',
    hubTitle: 'How well can you',
    hubTitleAccent: 'read the world?',
    hubLead: 'People, places and journeys leave traces. Find out how many you recognise.',
    playable: 'Play now',
    lifeLines: 'Life Lines',
    lifeLinesDescription: 'Identify famous people from their places of birth and death.',
    rounds: '10 rounds',
    people: '200 people',
    startGame: 'Start game',
    planned: 'Coming soon',
    landmarks: 'What is it?',
    landmarksDescription: 'Name a landmark from a photograph taken from above.',
    landmarkCount: '100 landmarks',
    landmarkStart: 'Start What is it?',
    cities: 'Which city?',
    citiesDescription: 'Name a city from a single aerial photograph.',
    journeys: 'Travel Traces',
    journeysDescription: 'Identify a journey from its route across the world map.',
    footer: 'A cooperative geography quiz for curious minds.',
    back: 'Back',
    howItWorks: 'How it works',
    introTitle: 'Follow the traces of a life.',
    placesTitle: 'Read the places',
    placesText: 'Birth and death appear as markers with years on the world map.',
    guessTitle: 'Guess the person',
    guessText: 'Enter a name. Surnames, known aliases and minor typos count.',
    hintsTitle: 'Weigh the clues',
    hintsText: 'Three clues can help you – each one reduces the available score.',
    firstSession: 'Start first session',
    loading: 'Loading world map …',
    sessionComplete: 'Session complete',
    recognised: (solved: number) => `${solved} of 10 people recognised`,
    bestScore: (score: number) => `Best score ${score.toLocaleString('en')}`,
    notSolved: 'not solved',
    newSession: 'New session',
    otherGames: 'Other games',
    hub: 'Hub',
    pointsShort: 'pts',
    round: (current: number) => `Round ${current}/10`,
    who: 'Who was this person?',
    twoPlaces: 'Two places. One life.',
    hidden: 'Still hidden',
    answerLabel: 'Name of the person',
    answerPlaceholder: 'Your guess …',
    check: 'Check',
    revealHint: (number: number) => `Reveal clue ${number}`,
    revealPerson: 'Reveal person',
    correct: 'Correct!',
    unresolved: 'Not solved this time.',
    hintRevealed: (number: number) => `Clue ${number} revealed.`,
    wrongHint: (number: number) => `Not quite – clue ${number} is now visible.`,
    correctlyIdentified: 'Correctly identified',
    mysteryPerson: 'Mystery person',
    born: 'Born',
    died: 'Died',
    sources: 'Sources',
    imageCredit: 'Image',
    showResults: 'View results',
    nextPerson: 'Next person',
    birth: 'Birth',
    death: 'Death',
    dragZoom: 'Drag and zoom',
    mapLabel: 'World map with places of birth and death',
    noPortrait: (name: string) => `No freely licensed portrait of ${name} is available`,
    landmarkIntroTitle: 'Name what you see from above.',
    landmarkPhotoTitle: 'Read the photograph',
    landmarkPhotoText: 'One unlabeled view, taken from above or at a steep angle.',
    landmarkGuessTitle: 'Name the landmark',
    landmarkGuessText: 'The city alone does not count. Known names and minor typos do.',
    landmarkRecognised: (solved: number) => `${solved} of 10 landmarks recognised`,
    landmarkWho: 'What is this?',
    landmarkPrompt: 'One photograph. One landmark.',
    landmarkAnswerLabel: 'Name of the landmark',
    landmarkReveal: 'Reveal landmark',
    landmarkNext: 'Next landmark',
    landmarkMystery: 'Mystery landmark',
    landmarkPhotoAlt: 'Aerial photograph of a landmark',
    landmarkMapLabel: 'World map with the landmark',
  },
  de: {
    tagline: 'Geografie neu entdecken',
    hubEyebrow: 'Vier Spiele · Eine Welt',
    hubTitle: 'Wie gut kannst du',
    hubTitleAccent: 'die Welt lesen?',
    hubLead: 'Menschen, Orte und Wege hinterlassen Spuren. Finde heraus, wie viele du erkennst.',
    playable: 'Jetzt spielbar',
    lifeLines: 'Lebenslinien',
    lifeLinesDescription: 'Erkenne berühmte Personen anhand ihres Geburts- und Todesortes.',
    rounds: '10 Runden',
    people: '200 Personen',
    startGame: 'Spiel starten',
    planned: 'In Planung',
    landmarks: 'Was ist das?',
    landmarksDescription: 'Benenne ein Wahrzeichen auf einem Foto von oben.',
    landmarkCount: '100 Wahrzeichen',
    landmarkStart: 'Was ist das? starten',
    cities: 'Welche Stadt?',
    citiesDescription: 'Benenne eine Stadt anhand eines Luftbilds.',
    journeys: 'Reisespuren',
    journeysDescription: 'Erkenne eine Reise anhand ihrer Route über die Weltkarte.',
    footer: 'Ein kooperatives Geografie-Quiz für Neugierige.',
    back: 'Zurück',
    howItWorks: 'So funktioniert es',
    introTitle: 'Folge den Spuren eines Lebens.',
    placesTitle: 'Orte lesen',
    placesText: 'Geburt und Tod erscheinen als Marker mit Jahreszahlen auf der Weltkarte.',
    guessTitle: 'Person erraten',
    guessText: 'Gib den Namen ein. Nachname, bekannte Aliase und kleine Tippfehler zählen.',
    hintsTitle: 'Hinweise abwägen',
    hintsText: 'Drei Hinweise helfen weiter – jeder kostet mögliche Punkte.',
    firstSession: 'Erste Session starten',
    loading: 'Weltkarte wird geladen …',
    sessionComplete: 'Session abgeschlossen',
    recognised: (solved: number) => `${solved} von 10 Personen erkannt`,
    bestScore: (score: number) => `Bestwert ${score.toLocaleString('de-DE')}`,
    notSolved: 'nicht gelöst',
    newSession: 'Neue Session',
    otherGames: 'Andere Spiele',
    hub: 'Hub',
    pointsShort: 'P',
    round: (current: number) => `Runde ${current}/10`,
    who: 'Wer war diese Person?',
    twoPlaces: 'Zwei Orte. Ein Leben.',
    hidden: 'Noch verborgen',
    answerLabel: 'Name der Person',
    answerPlaceholder: 'Deine Vermutung …',
    check: 'Prüfen',
    revealHint: (number: number) => `Hinweis ${number} aufdecken`,
    revealPerson: 'Person auflösen',
    correct: 'Richtig!',
    unresolved: 'Leider nicht gelöst.',
    hintRevealed: (number: number) => `Hinweis ${number} aufgedeckt.`,
    wrongHint: (number: number) => `Nicht richtig – Hinweis ${number} ist jetzt sichtbar.`,
    correctlyIdentified: 'Richtig erkannt',
    mysteryPerson: 'Gesuchte Person',
    born: 'Geboren',
    died: 'Gestorben',
    sources: 'Quellen',
    imageCredit: 'Bild',
    showResults: 'Ergebnis ansehen',
    nextPerson: 'Nächste Person',
    birth: 'Geburt',
    death: 'Tod',
    dragZoom: 'Ziehen und zoomen',
    mapLabel: 'Weltkarte mit Geburts- und Todesort',
    noPortrait: (name: string) => `Kein frei lizenziertes Porträt von ${name} hinterlegt`,
    landmarkIntroTitle: 'Benenne, was du von oben siehst.',
    landmarkPhotoTitle: 'Das Foto lesen',
    landmarkPhotoText: 'Eine Ansicht ohne Beschriftung, von oben oder aus steilem Winkel.',
    landmarkGuessTitle: 'Das Wahrzeichen benennen',
    landmarkGuessText: 'Die Stadt allein zählt nicht. Geläufige Namen und kleine Tippfehler gelten.',
    landmarkRecognised: (solved: number) => `${solved} von 10 Wahrzeichen erkannt`,
    landmarkWho: 'Was ist das?',
    landmarkPrompt: 'Ein Foto. Ein Wahrzeichen.',
    landmarkAnswerLabel: 'Name des Wahrzeichens',
    landmarkReveal: 'Wahrzeichen auflösen',
    landmarkNext: 'Nächstes Wahrzeichen',
    landmarkMystery: 'Gesuchtes Wahrzeichen',
    landmarkPhotoAlt: 'Luftbild eines Wahrzeichens',
    landmarkMapLabel: 'Weltkarte mit dem Wahrzeichen',
  },
} as const

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  copy: typeof ui.en | typeof ui.de
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    window.localStorage.getItem(LANGUAGE_KEY) === 'de' ? 'de' : 'en')

  useEffect(() => {
    document.documentElement.lang = language
    document.title = language === 'de'
      ? 'MapMinds – Geografie neu entdecken'
      : 'MapMinds – Rediscover geography'
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      language === 'de'
        ? 'MapMinds – das kooperative Geografie-Quiz über Menschen, Orte und Wege.'
        : 'MapMinds – a cooperative geography quiz about people, places and journeys.',
    )
  }, [language])

  const setLanguage = (nextLanguage: Language) => {
    window.localStorage.setItem(LANGUAGE_KEY, nextLanguage)
    setLanguageState(nextLanguage)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, copy: ui[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage muss innerhalb des LanguageProvider verwendet werden.')
  return context
}

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()
  return (
    <div className="language-switch" aria-label="Language">
      <button
        type="button"
        aria-label="English"
        aria-pressed={language === 'en'}
        title="English"
        onClick={() => setLanguage('en')}
      >
        <span aria-hidden="true">🇬🇧</span><b>EN</b>
      </button>
      <button
        type="button"
        aria-label="Deutsch"
        aria-pressed={language === 'de'}
        title="Deutsch"
        onClick={() => setLanguage('de')}
      >
        <span aria-hidden="true">🇩🇪</span><b>DE</b>
      </button>
    </div>
  )
}
