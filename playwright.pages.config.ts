import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './pages-e2e',
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --base /mapminds/',
    url: 'http://127.0.0.1:4173/mapminds/',
    reuseExistingServer: false,
  },
  use: {
    baseURL: 'http://127.0.0.1:4173/mapminds/',
  },
  projects: [
    { name: 'github-pages-chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
