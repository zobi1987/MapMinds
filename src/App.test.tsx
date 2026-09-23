import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { LanguageProvider } from './i18n'

const renderApp = () => render(<LanguageProvider><App /></LanguageProvider>)

describe('MapMinds hub', () => {
  beforeEach(() => window.localStorage.clear())

  it('shows English by default with two playable and two planned games', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: 'Life Lines' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'What is it?' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Which city?' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Travel Traces' })).toBeInTheDocument()
    expect(screen.getAllByText('Coming soon')).toHaveLength(2)
    expect(screen.getByRole('button', { name: /Start What is it/ })).toBeInTheDocument()
  })

  it('guides new players through the introduction', async () => {
    renderApp()
    await userEvent.click(screen.getByRole('button', { name: /Start game/ }))
    expect(screen.getByRole('heading', { name: 'Follow the traces of a life.' })).toBeInTheDocument()
    expect(screen.getByText('Read the places')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Back/ }))
    expect(screen.getByRole('heading', { name: 'Life Lines' })).toBeInTheDocument()
  })

  it('shows the landmark introduction once, then a photograph', async () => {
    renderApp()
    await userEvent.click(screen.getByRole('button', { name: /Start What is it/ }))
    expect(screen.getByRole('heading', { name: /from above/ })).toBeInTheDocument()
    expect(screen.queryByText('100 landmarks')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Back/ }))
    expect(screen.getByRole('heading', { name: 'What is it?' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Start What is it/ }))
    await userEvent.click(screen.getByRole('button', { name: /Start first session/ }))
    expect(await screen.findByRole('img', { name: 'Aerial photograph of a landmark' }, { timeout: 8000 })).toBeInTheDocument()
    expect(screen.queryByLabelText(/World map with the landmark/)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Hub/ }))
    await userEvent.click(screen.getByRole('button', { name: /Start What is it/ }))
    expect(screen.queryByRole('heading', { name: /from above/ })).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Aerial photograph of a landmark' })).toBeInTheDocument()
  }, 15000)

  it('switches the complete interface to German and remembers the choice', async () => {
    renderApp()
    await userEvent.click(screen.getByRole('button', { name: 'Deutsch' }))

    expect(screen.getByRole('heading', { name: 'Lebenslinien' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('de')
    expect(window.localStorage.getItem('mapminds.language')).toBe('de')
  })
})
