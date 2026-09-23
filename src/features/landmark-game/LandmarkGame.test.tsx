import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { landmarks } from '../../data/landmarks'
import { localizeLandmark } from '../../data/localizedLandmarks'
import { LanguageProvider } from '../../i18n'
import { LandmarkGame } from './LandmarkGame'

const renderGame = (onExit = () => {}) => render(
  <LanguageProvider>
    <LandmarkGame onExit={onExit} />
  </LanguageProvider>,
)

describe('Was ist das?', () => {
  beforeEach(() => window.localStorage.clear())

  it('zeigt beim Raten nur das Foto und die Karte erst nach der Auflösung', async () => {
    renderGame()
    const user = userEvent.setup()

    expect(screen.getByRole('img', { name: 'Aerial photograph of a landmark' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await user.type(screen.getByLabelText('Name of the landmark'), 'irgendwo')
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByRole('status')).toHaveTextContent('clue 1 is now visible')

    await user.click(screen.getByRole('button', { name: /Reveal clue 2/ }))
    expect(screen.getByRole('status')).toHaveTextContent('Clue 2 revealed')
    await user.click(screen.getByRole('button', { name: /Reveal clue 3/ }))
    await user.click(screen.getByRole('button', { name: /Reveal landmark/ }))

    expect(screen.getByLabelText(/World map with the landmark/)).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'Aerial photograph of a landmark' })).not.toBeInTheDocument()
    expect(screen.getByText('Mystery landmark')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Wikidata/ })).toBeInTheDocument()
  })

  it('erkennt den Namen des fotografierten Wahrzeichens', async () => {
    renderGame()
    const user = userEvent.setup()
    const src = screen.getByRole('img', { name: 'Aerial photograph of a landmark' }).getAttribute('src')
    const landmark = landmarks.find((entry) => entry.image.url === src)!
    const english = localizeLandmark(landmark, 'en')

    await user.type(screen.getByLabelText('Name of the landmark'), english.name)
    await user.click(screen.getByRole('button', { name: 'Check' }))

    expect(screen.getByRole('heading', { name: english.name })).toBeInTheDocument()
    expect(screen.getByText('Correctly identified')).toBeInTheDocument()
    expect(screen.getByText(/1,000/)).toBeInTheDocument()
  })

  it('speichert nach zehn ungelösten Runden den Bestwert und startet neu', async () => {
    const onExit = vi.fn()
    renderGame(onExit)
    const user = userEvent.setup()

    for (let round = 0; round < 10; round += 1) {
      await user.click(screen.getByRole('button', { name: /Reveal clue 1/ }))
      await user.click(screen.getByRole('button', { name: /Reveal clue 2/ }))
      await user.click(screen.getByRole('button', { name: /Reveal clue 3/ }))
      await user.click(screen.getByRole('button', { name: /Reveal landmark/ }))
      await user.click(screen.getByRole('button', {
        name: round === 9 ? /View results/ : /Next landmark/,
      }))
    }

    expect(screen.getByText('Session complete')).toBeInTheDocument()
    expect(screen.getByText(/0 of 10 landmarks recognised/)).toBeInTheDocument()
    expect(screen.getByText(/Best score 0/)).toBeInTheDocument()
    expect(window.localStorage.getItem('mapminds.landmark.bestScore')).toBe('0')

    await user.click(screen.getByRole('button', { name: 'New session' }))
    expect(screen.getByText('Round 1/10')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Hub/ }))
    expect(onExit).toHaveBeenCalledOnce()
  }, 20000)
})
