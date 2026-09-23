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

test('auf dem Handy ist die Karte größer als das Antwortfeld und das Namensfeld nicht vorausgewählt', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('mapminds.introSeen', 'true'))
  await page.reload()
  await page.getByRole('button', { name: /Start game/ }).click()

  const map = await page.locator('.world-map svg').boundingBox()
  const panel = await page.locator('.guess-panel').boundingBox()
  expect(map && panel).toBeTruthy()
  expect(map!.height).toBeGreaterThan(panel!.height)
  expect(map!.height / 844).toBeGreaterThan(0.62)
  await expect(page.getByLabel('Name of the person')).not.toBeFocused()
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

test('die Karte lässt sich deutlich weiter als sechsfach hineinzoomen', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('mapminds.introSeen', 'true'))
  await page.reload()
  await page.getByRole('button', { name: /Start game/ }).click()

  const map = page.locator('.world-map svg')
  const countries = page.locator('.rsm-geographies')
  const before = await countries.boundingBox()
  expect(before).toBeTruthy()

  await map.hover()
  for (let step = 0; step < 18; step += 1) {
    await page.mouse.wheel(0, -400)
  }
  await page.waitForTimeout(400)

  const after = await countries.boundingBox()
  expect(after).toBeTruthy()
  expect(after!.width / before!.width).toBeGreaterThan(8)
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

test('eine Wahrzeichen-Runde zeigt erst das Foto und die Karte nur bei der Auflösung', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('100 landmarks')).toBeVisible()
  await page.getByRole('button', { name: /Start What is it/ }).click()
  await expect(page.getByRole('heading', { name: /from above/ })).toBeVisible()
  await page.getByRole('button', { name: /Start first session/ }).click()

  await expect(page.getByText('Round 1/10')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Aerial photograph of a landmark' })).toBeVisible()
  await expect(page.getByLabel(/World map with the landmark/)).toHaveCount(0)
  await expect(page.getByLabel('Name of the landmark')).not.toBeFocused()

  await page.getByRole('button', { name: /Reveal clue 1/ }).click()
  await expect(page.locator('.score-track .active')).toHaveText('700')
  await page.getByRole('button', { name: /Reveal clue 2/ }).click()
  await page.getByRole('button', { name: /Reveal clue 3/ }).click()
  await page.getByRole('button', { name: /Reveal landmark/ }).click()

  await expect(page.getByLabel(/World map with the landmark/)).toBeVisible()
  await expect(page.getByRole('img', { name: 'Aerial photograph of a landmark' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Wikidata/ })).toBeVisible()

  await page.getByRole('button', { name: /Next landmark/ }).click()
  await expect(page.getByText('Round 2/10')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Aerial photograph of a landmark' })).toBeVisible()
  await expect(page.getByLabel(/World map with the landmark/)).toHaveCount(0)
})

test('eine Städterunde zeigt erst das Satellitenbild und die Karte nur bei der Auflösung', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('99 cities')).toBeVisible()
  await page.getByRole('button', { name: /Start Which city/ }).click()
  await expect(page.getByRole('heading', { name: /straight above/ })).toBeVisible()
  await page.getByRole('button', { name: /Start first session/ }).click()

  await expect(page.getByText('Round 1/10')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Satellite image of a city' })).toBeVisible()
  await expect(page.getByLabel(/World map with the city/)).toHaveCount(0)
  await expect(page.getByLabel('Name of the city')).not.toBeFocused()

  await page.getByRole('button', { name: /Reveal clue 1/ }).click()
  await page.getByRole('button', { name: /Reveal clue 2/ }).click()
  await page.getByRole('button', { name: /Reveal clue 3/ }).click()
  await page.getByRole('button', { name: /Reveal city/ }).click()

  await expect(page.getByLabel(/World map with the city/)).toBeVisible()
  await expect(page.getByRole('img', { name: 'Satellite image of a city' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Wikidata/ })).toBeVisible()
})

test('auf dem Handy füllt das Wahrzeichen-Foto die Ansicht und das Namensfeld ist nicht vorausgewählt', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('mapminds.landmark.introSeen', 'true'))
  await page.reload()
  await page.getByRole('button', { name: /Start What is it/ }).click()

  const photo = await page.getByRole('img', { name: 'Aerial photograph of a landmark' }).boundingBox()
  expect(photo).toBeTruthy()
  expect(photo!.height / 844).toBeGreaterThan(0.45)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await expect(page.getByLabel('Name of the landmark')).not.toBeFocused()
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
