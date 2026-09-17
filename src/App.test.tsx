import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { LanguageProvider } from './i18n'

const renderApp = () => render(<LanguageProvider><App /></LanguageProvider>)

describe('MapMinds hub', () => {
  beforeEach(() => window.localStorage.clear())

  it('shows English by default with one playable and two planned games', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: 'Life Lines' })).toBeInTheDocument()
    expect(screen.getAllByText('Coming soon')).toHaveLength(2)
  })

  it('guides new players through the introduction', async () => {
    renderApp()
    await userEvent.click(screen.getByRole('button', { name: /Start game/ }))
    expect(screen.getByRole('heading', { name: 'Follow the traces of a life.' })).toBeInTheDocument()
    expect(screen.getByText('Read the places')).toBeInTheDocument()
  })

  it('switches the complete interface to German and remembers the choice', async () => {
    renderApp()
    await userEvent.click(screen.getByRole('button', { name: 'Deutsch' }))

    expect(screen.getByRole('heading', { name: 'Lebenslinien' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('de')
    expect(window.localStorage.getItem('mapminds.language')).toBe('de')
  })
})
