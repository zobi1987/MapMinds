import { expect, test } from '@playwright/test'

test('GitHub-Pages-Build lädt Hub und Spiel unter einem Repository-Unterpfad', async ({ page }) => {
  await page.goto('./')
  await expect(page).toHaveTitle(/MapMinds/)
  await page.getByRole('button', { name: /Start game/ }).click()
  await page.getByRole('button', { name: /Start first session/ }).click()

  await expect(page.getByText('Round 1/10')).toBeVisible()
  await expect(page.getByLabel(/World map with places/)).toBeVisible()
  await expect(page.getByLabel('Name of the person')).toBeVisible()
})
