import { readFile, writeFile } from 'node:fs/promises'

const source = await readFile(new URL('../src/data/people.ts', import.meta.url), 'utf8')
const ids = [...source.matchAll(/\['(Q\d+)',\s*'([^']+)'/g)]
  .map(([, id, name]) => ({ id, name }))

const chunks = (values, size) =>
  Array.from({ length: Math.ceil(values.length / size) }, (_, index) =>
    values.slice(index * size, index * size + size))

const filenames = new Map()
for (const batch of chunks(ids, 50)) {
  const params = new URLSearchParams({
    action: 'wbgetentities',
    ids: batch.map(({ id }) => id).join('|'),
    props: 'claims',
    format: 'json',
    origin: '*',
  })
  const response = await fetch(`https://www.wikidata.org/w/api.php?${params}`)
  if (!response.ok) throw new Error(`Wikidata antwortete mit ${response.status}`)
  const data = await response.json()
  for (const { id } of batch) {
    const filename = data.entities[id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value
    if (filename) filenames.set(id, filename)
  }
}

const stripHtml = (value = '') => value
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim()

const portraits = {}
for (const batch of chunks([...filenames.entries()], 25)) {
  const params = new URLSearchParams({
    action: 'query',
    titles: batch.map(([, filename]) => `File:${filename}`).join('|'),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '360',
    format: 'json',
    origin: '*',
  })
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`)
  if (!response.ok) throw new Error(`Commons antwortete mit ${response.status}`)
  const data = await response.json()
  for (const page of Object.values(data.query.pages)) {
    const info = page.imageinfo?.[0]
    const filename = page.title?.replace(/^File:/, '')
    const id = [...filenames.entries()].find(([, value]) => value === filename)?.[0]
    if (!id || !info?.thumburl || !info?.descriptionurl) continue
    const meta = info.extmetadata ?? {}
    portraits[id] = {
      url: info.thumburl,
      pageUrl: info.descriptionurl,
      creator: stripHtml(meta.Artist?.value) || 'Unbekannte Urheberschaft',
      license: meta.LicenseShortName?.value || meta.UsageTerms?.value || 'Siehe Bildquelle',
    }
  }
}

const output = `// Automatisch aus Wikidata und Wikimedia Commons erzeugt.\n`
  + `// Aktualisieren: node scripts/fetch-portraits.mjs\n`
  + `import type { Person } from '../domain/personSchema'\n\n`
  + `export const portraits: Record<string, NonNullable<Person['portrait']>> = `
  + `${JSON.stringify(portraits, null, 2)}\n`

await writeFile(new URL('../src/data/portraits.generated.ts', import.meta.url), output)
console.log(`${Object.keys(portraits).length} frei beschriebene Commons-Porträts erfasst.`)
