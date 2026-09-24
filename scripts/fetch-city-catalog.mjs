import { readFile, writeFile } from 'node:fs/promises'
import { citySeeds } from './city-seeds.mjs'

if (citySeeds.length !== 99) throw new Error(`Expected 99 seeds, got ${citySeeds.length}`)

const headers = { 'User-Agent': 'MapMindsCatalog/1.0 (https://github.com/zobi1987/MapMinds)' }
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchJson(url) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const response = await fetch(url, { headers })
      if (response.ok) return JSON.parse(await response.text())
      if (response.status === 429 || response.status >= 500) {
        await sleep(1500 * (attempt + 1))
        continue
      }
      throw new Error(`${response.status} ${url}`)
    } catch (error) {
      if (attempt === 5) throw error
      await sleep(1500 * (attempt + 1))
    }
  }
  throw new Error(`failed ${url}`)
}

const regions = {
  Frankreich: [[-5, 10], [41, 52]],
  'Vereinigtes Königreich': [[-8, 2], [49, 61]],
  Italien: [[6, 19], [36, 47]],
  Spanien: [[-10, 5], [35, 44]],
  Niederlande: [[3, 7], [50, 54]],
  Deutschland: [[5, 16], [47, 55]],
  Tschechien: [[12, 19], [48, 52]],
  Österreich: [[9, 17], [46, 49]],
  Griechenland: [[19, 30], [34, 42]],
  Portugal: [[-10, -6], [36, 42]],
  Türkei: [[25, 45], [36, 42]],
  USA: [[-130, -66], [24, 50]],
  Kanada: [[-141, -52], [41, 70]],
  Japan: [[129, 146], [30, 46]],
  China: [[73, 135], [18, 54]],
  'Vereinigte Arabische Emirate': [[51, 57], [22, 27]],
  Thailand: [[97, 106], [5, 21]],
  Südkorea: [[125, 130], [33, 39]],
  Indien: [[68, 98], [6, 36]],
  Ägypten: [[24, 37], [22, 32]],
  Südafrika: [[16, 33], [-35, -22]],
  Marokko: [[-13, -1], [27, 36]],
  Kenia: [[33, 42], [-5, 5]],
  Brasilien: [[-74, -34], [-34, 6]],
  Mexiko: [[-118, -86], [14, 33]],
  Argentinien: [[-74, -53], [-56, -21]],
  Australien: [[112, 154], [-44, -10]],
  Ungarn: [[16, 23], [45.7, 48.6]],
  Dänemark: [[8, 13], [54, 58]],
  Irland: [[-11, -5], [51, 56]],
  Polen: [[14, 25], [49, 55]],
  Schweden: [[10, 25], [55, 70]],
  Belgien: [[2, 7], [49, 52]],
  Vietnam: [[102, 110], [8, 24]],
  Nepal: [[80, 89], [26, 31]],
  Indonesien: [[95, 141], [-11, 6]],
  Nigeria: [[2, 15], [4, 14]],
  Ghana: [[-4, 2], [4, 12]],
  Senegal: [[-18, -11], [12, 17]],
  Kuba: [[-85, -74], [19, 24]],
  Ecuador: [[-82, -75], [-5, 2]],
  Panama: [[-83, -77], [7, 10]],
  Kolumbien: [[-79, -66], [-5, 13]],
  Neuseeland: [[166, 179], [-48, -34]],
  Norwegen: [[4, 32], [57, 72]],
  Lettland: [[20, 29], [55, 58]],
  Estland: [[21, 29], [57, 60]],
  Kroatien: [[13, 20], [42, 47]],
  Island: [[-25, -13], [63, 67]],
  Malaysia: [[99, 120], [0.5, 8]],
  Tansania: [[29, 41], [-12, -1]],
  Mosambik: [[30, 41], [-27, -10]],
  Namibia: [[11, 26], [-29, -16]],
  Madagaskar: [[43, 51], [-26, -11]],
  Chile: [[-76, -66], [-56, -17]],
  Peru: [[-82, -68], [-19, 0]],
  Bolivien: [[-70, -57], [-23, -9]],
  Fidschi: [[176, 180], [-20, -12]],
  Äthiopien: [[33, 48], [3, 15]],
  Rumänien: [[20, 30], [43, 49]],
  Kambodscha: [[102, 108], [10, 15]],
  Katar: [[50.5, 52], [24, 27]],
  Pakistan: [[60, 78], [23, 37]],
  Libanon: [[35, 37], [33, 35]],
  'Saudi-Arabien': [[34, 56], [16, 33]],
  Georgien: [[39, 47], [41, 44]],
  Mongolei: [[87, 120], [41, 53]],
  Tunesien: [[7, 12], [30, 38]],
  Uruguay: [[-59, -53], [-35, -30]],
  Usbekistan: [[55, 74], [37, 46]],
  Nordkorea: [[124, 131], [37, 43]],
  Jordanien: [[34, 40], [29, 34]],
  Aserbaidschan: [[44, 52], [38, 42]],
}

const inRegion = (seed, point) => {
  const box = regions[seed.country]
  if (!box) throw new Error(`Keine Region für ${seed.country}`)
  const [lon, lat] = box
  return point.lon >= lon[0] && point.lon <= lon[1] && point.lat >= lat[0] && point.lat <= lat[1]
}

const badFile = /map\b|diagram|logo|icon|painting|drawing|\.svg|plan\b|night|moon|cyclone|hurricane|typhoon|airport|locator|flag\b|heatmap|air show|model of|false color|festival|street view|anniversary|post office|arena|stadium|fenway|main square|railway station|alyth|five dock|porto velho|porto germeno|air quality|sentinel at the|satellite town|satellite dish|satellite event|satellite campus|satellite antenna|hackathon|workers|disneyland|interferogram|crater|labelled|labeled|\bborder\b|interior|terminal 2|montana|\bmt\b|el salvador|gulf of riga/i
const goodFile = /satellite|sentinel-?\d|landsat|earth from space|hodoyoshi|\bspot \d|\(aster\)| aster |esa\d{4,}|envisat/i

async function categoriesFor(prefix) {
  const params = new URLSearchParams({
    action: 'query', list: 'allpages', apnamespace: '14', apprefix: prefix, aplimit: '8', format: 'json',
  })
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`)
  return (data.query?.allpages ?? []).map((page) => page.title)
}

async function filesInCategory(title) {
  const params = new URLSearchParams({
    action: 'query', list: 'categorymembers', cmtitle: title, cmtype: 'file', cmlimit: '40', format: 'json',
  })
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`)
  return (data.query?.categorymembers ?? []).map((page) => page.title).filter((name) => !badFile.test(name))
}

async function searchTitles(query) {
  const params = new URLSearchParams({
    action: 'query', list: 'search', srsearch: `${query} filetype:bitmap`, srnamespace: '6', srlimit: '12', format: 'json',
  })
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`)
  return (data.query?.search ?? []).map((hit) => hit.title)
}

function nameNeedles(seed) {
  const phrase = seed.enName
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
  return [phrase, phrase.replace(/ /g, '')]
}

function rankTitles(titles, seed) {
  const needles = nameNeedles(seed)
  return titles
    .map((title) => {
      const text = title.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
      const compact = text.replace(/[^a-z0-9]+/g, '')
      const named = text.includes(needles[0]) || compact.includes(needles[1])
      const score = named && goodFile.test(text) && !badFile.test(text)
        ? 10 + (/satellite view|satellite image|satellite picture/.test(text) ? 8 : 0)
        : -1
      return { title, score }
    })
    .filter((hit) => hit.score >= 10)
    .sort((left, right) => right.score - left.score)
    .slice(0, 6)
    .map((hit) => hit.title)
}

async function resolveImage(titles) {
  for (let index = 0; index < titles.length; index += 3) {
    const batch = titles.slice(index, index + 3)
    const params = new URLSearchParams({
      action: 'query', titles: batch.join('|'), prop: 'imageinfo',
      iiprop: 'url|mime|extmetadata', iiurlwidth: '1400', format: 'json',
    })
    const info = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`)
    const pages = Object.values(info.query?.pages ?? {}).filter((page) => page.imageinfo)
    for (const title of batch) {
      const page = pages.find((candidate) => candidate.title === title) ?? (batch.length === 1 ? pages[0] : undefined)
      const image = page?.imageinfo?.[0]
      const license = `${image?.extmetadata?.LicenseShortName?.value ?? ''} ${image?.extmetadata?.UsageTerms?.value ?? ''}`
      if (image?.thumburl?.startsWith('https://') && image.descriptionurl?.startsWith('https://')
        && /^image\/(jpeg|png|webp)$/.test(image.mime ?? '')
        && !/non-free|fair use/i.test(license)) {
        return page
      }
    }
  }
  return null
}

const pinned = {
  Q406: 'Istanbul by Sentinel-2, 2020-05-09.jpg',
  Q1773: 'Riga SPOT 1024.jpg',
  Q2222874: 'Digging Into the History of Stone Town (154309 - oli 20240624 lrg).jpg',
  Q3805: 'Amman SPOT 1111.jpg',
  Q9248: 'Baku, Azerbaijan, satellite image, LandSat-5, 2010-09-06.jpg',
}

const cachePath = new URL('./city-image-cache.json', import.meta.url)
let cache = {}
try {
  cache = JSON.parse(await readFile(cachePath, 'utf8'))
} catch {
  cache = {}
}

const ids = [...new Set(citySeeds.map((seed) => seed.q))]
const entities = {}
for (let index = 0; index < ids.length; index += 40) {
  const params = new URLSearchParams({
    action: 'wbgetentities', ids: ids.slice(index, index + 40).join('|'),
    props: 'labels|claims', languages: 'en', format: 'json',
  })
  const data = await fetchJson(`https://www.wikidata.org/w/api.php?${params}`)
  Object.assign(entities, data.entities)
  await sleep(300)
}

const coords = {}
for (const seed of citySeeds) {
  const entity = entities[seed.q]
  const label = entity?.labels?.en?.value ?? ''
  const point = entity?.claims?.P625?.[0]?.mainsnak?.datavalue?.value
  const expected = seed.enName.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').slice(0, 5)
  const actual = label.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
  if (!actual.includes(expected.trim())) {
    throw new Error(`Label mismatch ${seed.q} ${seed.enName} => ${label}`)
  }
  if (!point) throw new Error(`No coordinates ${seed.q} ${seed.enName}`)
  const rounded = { lon: Math.round(point.longitude * 100) / 100, lat: Math.round(point.latitude * 100) / 100 }
  if (!inRegion(seed, rounded)) throw new Error(`Outside ${seed.country}: ${seed.enName} ${rounded.lon},${rounded.lat}`)
  coords[seed.q] = rounded
}

for (const seed of citySeeds) {
  if (cache[seed.q] && !pinned[seed.q]) {
    console.error(`CACHE ${seed.q} ${seed.name}`)
    continue
  }
  const queryName = seed.search ?? seed.enName
  let titles = pinned[seed.q] ? [`File:${pinned[seed.q]}`] : []
  if (pinned[seed.q]) {
    const page = await resolveImage(titles)
    if (!page) console.error(`NO IMAGE ${seed.q} ${seed.name}`)
    else {
      const image = page.imageinfo[0]
      const meta = image.extmetadata ?? {}
      cache[seed.q] = {
        url: image.thumburl,
        pageUrl: image.descriptionurl,
        creator: (meta.Artist?.value ?? 'Unbekannte Urheberschaft').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
        license: meta.LicenseShortName?.value || meta.UsageTerms?.value || 'Siehe Bildquelle',
        title: page.title,
      }
      console.error(`${seed.q} ${seed.name} <- ${page.title}`)
    }
    await sleep(250)
    continue
  }
  const categories = await categoriesFor(`Satellite pictures of ${queryName}`)
  const exact = categories.find((title) => title === `Category:Satellite pictures of ${queryName}`)
  if (exact) titles = rankTitles(await filesInCategory(exact), seed)
  if (!titles.length) {
    for (const query of [`${queryName} satellite`, `${queryName} Sentinel-2`, `${queryName} Landsat`, `${queryName} SPOT`, `${seed.enName} ASTER`, `${seed.enName} Earth from Space`]) {
      titles = rankTitles(await searchTitles(query), seed)
      if (titles.length) break
      await sleep(350)
    }
  }
  const page = titles.length ? await resolveImage(titles) : null
  if (!page) {
    console.error(`NO IMAGE ${seed.q} ${seed.name}`)
  } else {
    const image = page.imageinfo[0]
    const meta = image.extmetadata ?? {}
    cache[seed.q] = {
      url: image.thumburl,
      pageUrl: image.descriptionurl,
      creator: (meta.Artist?.value ?? 'Unbekannte Urheberschaft').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      license: meta.LicenseShortName?.value || meta.UsageTerms?.value || 'Siehe Bildquelle',
      title: page.title,
    }
    console.error(`${seed.q} ${seed.name} <- ${page.title}`)
  }
  await sleep(300)
}
await writeFile(cachePath, JSON.stringify(cache, null, 2))

const missing = citySeeds.filter((seed) => !cache[seed.q]).map((seed) => `${seed.q} ${seed.name}`)
if (missing.length) throw new Error(`Missing images:\n${missing.join('\n')}`)

const quote = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const slug = (name) => name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const imageFile = `// Automatisch aus Wikimedia Commons erzeugt.\n`
  + `// Aktualisieren: node scripts/fetch-city-catalog.mjs\n`
  + `import type { City } from '../domain/citySchema'\n\n`
  + `export const cityImages: Record<string, City['image']> = ${JSON.stringify(
    Object.fromEntries(citySeeds.map((seed) => [seed.q, {
      url: cache[seed.q].url,
      pageUrl: cache[seed.q].pageUrl,
      creator: cache[seed.q].creator,
      license: cache[seed.q].license,
    }])),
    null,
    2,
  )}\n`
await writeFile(new URL('../src/data/cityImages.generated.ts', import.meta.url), imageFile)

const lines = citySeeds.map((seed) => {
  const point = coords[seed.q]
  const aliases = `[${seed.aliases.map(quote).join(', ')}]`
  return `  [${quote(seed.q)}, ${quote(seed.name)}, ${aliases}, ${quote(seed.kind)}, ${quote(seed.fact)}, ${quote(seed.difficulty)}, [${quote(seed.name)}, ${quote(seed.country)}, ${point.lon}, ${point.lat}]],`
})

const citiesTs = `import { validateCities, type City } from '../domain/citySchema'
import { cityImages } from './cityImages.generated'

type PlaceSeed = [name: string, country: string, longitude: number, latitude: number]
type CitySeed = [
  wikidataId: string,
  name: string,
  aliases: string[],
  kind: string,
  fact: string,
  difficulty: City['difficulty'],
  place: PlaceSeed,
]

const slug = (name: string) => name
  .normalize('NFD').replace(/\\p{Diacritic}/gu, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const seeds: CitySeed[] = [
${lines.join('\n')}
]

const catalogInput: City[] = seeds.map(([
  wikidataId, name, aliases, kind, fact, difficulty, place,
]) => ({
  id: slug(name),
  wikidataId,
  name,
  aliases,
  difficulty,
  place: {
    name: place[0],
    country: place[1],
    coordinates: [place[2], place[3]],
  },
  hints: [kind, fact, place[1]],
  summary: fact,
  sources: [{ label: 'Wikidata', url: \`https://www.wikidata.org/wiki/\${wikidataId}\` }],
  image: cityImages[wikidataId],
}))

export const cities = validateCities(catalogInput)
`
await writeFile(new URL('../src/data/cities.ts', import.meta.url), citiesTs)

const translations = citySeeds.map((seed) => `  '${slug(seed.name)}': {
    hints: [${JSON.stringify(seed.enKind)}, ${JSON.stringify(seed.enFact)}, ${JSON.stringify(seed.enCountry)}],
    summary: ${JSON.stringify(seed.enFact)},
    place: { name: ${JSON.stringify(seed.enName)}, country: ${JSON.stringify(seed.enCountry)} },
  },`)
const names = citySeeds
  .filter((seed) => seed.enName !== seed.name)
  .map((seed) => `  ${seed.q}: ${JSON.stringify(seed.enName)},`)

const enFile = `export interface EnglishCityTranslation {
  hints: [string, string, string]
  summary: string
  place: { name: string; country: string }
}

export const englishCityTranslations: Record<string, EnglishCityTranslation> = {
${translations.join('\n')}
}

export const englishCityNames: Record<string, string> = {
${names.join('\n')}
}
`
await writeFile(new URL('../src/data/cityTranslations.en.ts', import.meta.url), enFile)
console.error('wrote city catalog')
