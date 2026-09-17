import { expect, test } from '@playwright/test'

test('spielt eine vollständige Session bis zum Ergebnis', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Start game/ }).click()
  await page.getByRole('button', { name: /Start first session/ }).click()

  for (let round = 0; round < 10; round += 1) {
    await expect(page.getByText(`Round ${round + 1}/10`)).toBeVisible()
    await page.getByRole('button', { name: /Reveal clue 1/ }).click()
    await page.getByRole('button', { name: /Reveal clue 2/ }).click()
    await page.getByRole('button', { name: /Reveal clue 3/ }).click()
    await page.getByRole('button', { name: /Reveal person/ }).click()
    await page.getByRole('button', {
      name: round === 9 ? /View results/ : /Next person/,
    }).click()
  }

  await expect(page.getByText('Session complete')).toBeVisible()
  await expect(page.getByText('0 of 10 people recognised')).toBeVisible()
})

test('Karte und Eingabe passen in eine mobile Ansicht', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('mapminds.introSeen', 'true'))
  await page.reload()
  await page.getByRole('button', { name: /Start game/ }).click()

  await expect(page.getByLabel(/World map with places/)).toBeVisible()
  await expect(page.getByLabel('Name of the person')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Check' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('Marker und Jahreszahlen behalten beim Zoomen ihre lesbare Größe', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('mapminds.introSeen', 'true'))
  await page.reload()
  await page.getByRole('button', { name: /Start game/ }).click()

  const map = page.locator('.world-map svg')
  const countries = page.locator('.rsm-geographies')
  const marker = page.locator('.map-marker--birth circle').first()
  const yearLabel = page.locator('.map-marker--birth + .map-marker__label')

  const countriesBefore = await countries.boundingBox()
  const markerBefore = await marker.boundingBox()
  const labelBefore = await yearLabel.boundingBox()
  expect(countriesBefore && markerBefore && labelBefore).toBeTruthy()

  await map.hover()
  await page.mouse.wheel(0, -900)
  await page.waitForTimeout(500)

  const countriesAfter = await countries.boundingBox()
  const markerAfter = await marker.boundingBox()
  const labelAfter = await yearLabel.boundingBox()
  expect(countriesAfter && markerAfter && labelAfter).toBeTruthy()
  expect(countriesAfter!.width).toBeGreaterThan(countriesBefore!.width * 1.2)
  expect(markerAfter!.width).toBeLessThan(markerBefore!.width * 1.2)
  expect(labelAfter!.width).toBeLessThan(labelBefore!.width * 1.2)
})

test('Ortsnamen bleiben bis zur Auflösung verborgen und erscheinen mit Quellen', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('mapminds.introSeen', 'true'))
  await page.reload()
  await page.getByRole('button', { name: /Start game/ }).click()

  const concealedText = await page.locator('body').innerText()
  await page.getByRole('button', { name: /Reveal clue 1/ }).click()
  await expect(page.locator('.score-track .active')).toHaveText('700')
  await page.getByRole('button', { name: /Reveal clue 2/ }).click()
  await page.getByRole('button', { name: /Reveal clue 3/ }).click()
  await page.getByRole('button', { name: /Reveal person/ }).click()

  const birthPlace = await page.locator('.places dd').first().innerText()
  const city = birthPlace.split(',')[0]
  expect(concealedText).not.toContain(city)
  await expect(page.getByText('Sources')).toBeVisible()
  await expect(page.getByRole('link', { name: /Wikidata/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Image:/ })).toBeVisible()
})

test('die Einführung erscheint nur beim ersten Spielstart', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Start game/ }).click()
  await expect(page.getByRole('heading', { name: /traces of a life/ })).toBeVisible()
  await page.getByRole('button', { name: /Start first session/ }).click()
  await page.getByRole('button', { name: '← Hub' }).click()

  await page.getByRole('button', { name: /Start game/ }).click()
  await expect(page.getByText('Round 1/10')).toBeVisible()
  await expect(page.getByRole('heading', { name: /traces of a life/ })).toHaveCount(0)
})

test('wechselt Oberfläche und Spielinhalte zwischen Englisch und Deutsch', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Life Lines' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')

  await page.getByRole('button', { name: 'Deutsch' }).click()
  await expect(page.getByRole('heading', { name: 'Lebenslinien' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Lebenslinien' })).toBeVisible()

  await page.getByRole('button', { name: /Spiel starten/ }).click()
  await page.getByRole('button', { name: /Erste Session starten/ }).click()
  await page.getByRole('button', { name: /Hinweis 1 aufdecken/ }).click()
  await page.getByRole('button', { name: /Hinweis 2 aufdecken/ }).click()
  const germanHints = await page.locator('.hint--visible p').allTextContents()

  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByText('Who was this person?')).toBeVisible()
  await expect(page.getByLabel('Name of the person')).toBeVisible()
  const englishHints = await page.locator('.hint--visible p').allTextContents()
  expect(englishHints).not.toEqual(germanHints)
})
