import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { cities } from '../../data/cities'
import { localizeCity } from '../../data/localizedCities'
import { LanguageProvider } from '../../i18n'
import { CityGame } from './CityGame'

const renderGame = () => render(
  <LanguageProvider>
    <CityGame onExit={() => {}} />
  </LanguageProvider>,
)

describe('Welche Stadt?', () => {
  beforeEach(() => window.localStorage.clear())

  it('zeigt beim Raten nur das Satellitenbild und die Karte erst nach der Auflösung', async () => {
    renderGame()
    const user = userEvent.setup()

    expect(screen.getByRole('img', { name: 'Satellite image of a city' })).toBeInTheDocument()
    expect(screen.queryByLabelText(/World map with the city/)).not.toBeInTheDocument()

    await user.type(screen.getByLabelText('Name of the city'), 'irgendwo')
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByRole('status')).toHaveTextContent('clue 1 is now visible')

    await user.click(screen.getByRole('button', { name: /Reveal clue 2/ }))
    await user.click(screen.getByRole('button', { name: /Reveal clue 3/ }))
    await user.click(screen.getByRole('button', { name: /Reveal city/ }))

    expect(screen.getByLabelText(/World map with the city/)).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'Satellite image of a city' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Wikidata/ })).toBeInTheDocument()
  })

  it('erkennt den Namen der abgebildeten Stadt', async () => {
    renderGame()
    const user = userEvent.setup()
    const src = screen.getByRole('img', { name: 'Satellite image of a city' }).getAttribute('src')
    const city = cities.find((entry) => entry.image.url === src)!
    const english = localizeCity(city, 'en')

    await user.type(screen.getByLabelText('Name of the city'), english.name)
    await user.click(screen.getByRole('button', { name: 'Check' }))

    expect(screen.getByRole('heading', { name: english.name })).toBeInTheDocument()
    expect(screen.getByText('Correctly identified')).toBeInTheDocument()
    expect(screen.getByText(/1,000/)).toBeInTheDocument()
  })
})
