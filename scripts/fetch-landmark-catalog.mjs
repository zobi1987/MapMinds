import { readFile, writeFile } from 'node:fs/promises'

const seeds = JSON.parse(await readFile(new URL('./landmark-seeds.json', import.meta.url), 'utf8'))
if (seeds.length !== 100) throw new Error(`Expected 100 seeds, got ${seeds.length}`)

const headers = { 'User-Agent': 'MapMindsCatalog/1.0 (https://github.com/zobi1987/MapMinds)' }
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchJson(url) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const response = await fetch(url, { headers })
      if (response.ok) {
        const text = await response.text()
        try {
          return JSON.parse(text)
        } catch {
          await sleep(1200 * (attempt + 1))
          continue
        }
      }
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

const chunks = (values, size) =>
  Array.from({ length: Math.ceil(values.length / size) }, (_, index) => values.slice(index * size, index * size + size))

const normalize = (value) => value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

const regions = {
  Frankreich: [[-5, 10], [41, 52]],
  USA: [[-130, -66], [24, 50]],
  Italien: [[6, 19], [36, 47]],
  China: [[73, 135], [18, 54]],
  Indien: [[68, 98], [6, 36]],
  Ägypten: [[24, 37], [22, 32]],
  Australien: [[112, 154], [-44, -10]],
  Brasilien: [[-74, -34], [-34, 6]],
  England: [[-6, 2], [49, 56]],
  Spanien: [[-10, 5], [35, 44]],
  Peru: [[-82, -68], [-19, 0]],
  'Vereinigte Arabische Emirate': [[51, 57], [22, 27]],
  Jordanien: [[34, 40], [29, 34]],
  Kambodscha: [[102, 108], [10, 15]],
  Deutschland: [[5, 16], [47, 55]],
  Griechenland: [[19, 30], [34, 42]],
  Russland: [[30, 40], [54, 57]],
  Chile: [[-110, -66], [-56, -17]],
  Kanada: [[-141, -52], [41, 70]],
  Schottland: [[-8, 0], [54, 61]],
  Tschechien: [[12, 19], [48, 52]],
  Österreich: [[9, 17], [46, 49]],
  Türkei: [[25, 45], [36, 42]],
  Mexiko: [[-118, -86], [14, 33]],
  Indonesien: [[95, 141], [-11, 6]],
  Singapur: [[103, 105], [1, 2]],
  Äthiopien: [[33, 48], [3, 15]],
  Mali: [[-12, 5], [10, 25]],
  Marokko: [[-13, -1], [27, 36]],
  Algerien: [[-2, 12], [18, 37]],
  'Sri Lanka': [[79, 82], [5, 10]],
  Myanmar: [[92, 102], [9, 29]],
  Japan: [[129, 146], [30, 46]],
  Guatemala: [[-93, -88], [13, 18]],
  Iran: [[44, 64], [25, 40]],
  Usbekistan: [[56, 73], [37, 46]],
  Syrien: [[35, 42], [32, 37]],
  Südafrika: [[16, 33], [-35, -22]],
  Vatikanstadt: [[12.44, 12.46], [41.89, 41.91]],
  Malaysia: [[99, 120], [0.5, 8]],
  Ungarn: [[16, 23], [45.7, 48.6]],
  Thailand: [[97, 106], [5, 21]],
  Israel: [[34.2, 35.9], [29.4, 33.4]],
  Sambia: [[21, 34], [-18.5, -8]],
  Argentinien: [[-74, -53], [-56, -21]],
  Bolivien: [[-70, -57], [-23, -9]],
  Tunesien: [[7, 12], [30, 38]],
  Sudan: [[21, 39], [8, 23]],
  Simbabwe: [[25, 34], [-23, -15]],
  Philippinen: [[116, 127], [4, 21]],
}

const inRegion = (seed, point) => {
  const box = regions[seed.country]
  if (!box) return false
  const [lon, lat] = box
  return point.longitude >= lon[0] && point.longitude <= lon[1]
    && point.latitude >= lat[0] && point.latitude <= lat[1]
}

const GENERIC_LABEL = new Set(['church', 'tower', 'palace', 'mosque', 'temple', 'castle', 'bridge', 'cathedral', 'building', 'basilica', 'great', 'saint', 'mount', 'house', 'gate'])

const labelMatches = (seed, label) => {
  const names = [seed.enName, seed.name, seed.enPlace, seed.place, ...seed.aliases].map(normalize)
  const normalizedLabel = normalize(label)
  if (names.some((name) => name.length >= 4 && (name.includes(normalizedLabel) || normalizedLabel.includes(name)))) return true
  const tokens = normalizedLabel.split(/[^a-z0-9]+/).filter((word) => word.length >= 5 && !GENERIC_LABEL.has(word))
  return tokens.some((token) => names.some((name) => name.includes(token.slice(0, 5))))
}

const coords = {}
for (const batch of chunks(seeds, 40)) {
  const params = new URLSearchParams({
    action: 'wbgetentities',
    ids: batch.map((seed) => seed.q).join('|'),
    props: 'claims|labels',
    languages: 'en',
    format: 'json',
    origin: '*',
  })
  const data = await fetchJson(`https://www.wikidata.org/w/api.php?${params}`)
  for (const seed of batch) {
    const entity = data.entities[seed.q]
    const point = entity?.claims?.P625?.[0]?.mainsnak?.datavalue?.value
    const label = entity?.labels?.en?.value ?? ''
    if (!point || !labelMatches(seed, label) || !inRegion(seed, point)) {
      console.error(`Rejected ${seed.q} ${seed.enName} <- ${label || 'missing'} @ ${point ? `${point.longitude.toFixed(2)},${point.latitude.toFixed(2)}` : 'no coordinates'}`)
      continue
    }
    coords[seed.q] = {
      lon: Number(point.longitude.toFixed(2)),
      lat: Number(point.latitude.toFixed(2)),
      label: entity.labels?.en?.value ?? '',
    }
  }
  await sleep(400)
}

const missingCoords = seeds.filter((seed) => !coords[seed.q])
if (missingCoords.length) {
  throw new Error(`Missing coordinates: ${missingCoords.map((seed) => seed.q).join(', ')}`)
}

const stripHtml = (value = '') => value
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim()

const badFile = /map\b|diagram|logo|icon|painting|drawing|svg|plan\b|engraving|collage|postcard/i
const aerialWord = /aerial|satellite|bird'?s|overhead|luftbild|luchtfoto|aerienne|aérienne|air view|from above|nadir/i

async function categoriesFor(prefix) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'allpages',
    apnamespace: '14',
    apprefix: prefix,
    aplimit: '8',
    format: 'json',
    origin: '*',
  })
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`)
  return (data.query?.allpages ?? []).map((page) => page.title)
}

function pickCategory(categories, prefix, seed) {
  const exact = `Category:${prefix}`
  if (categories.includes(exact)) return exact
  const place = normalize(seed.enPlace)
  const country = normalize(seed.enCountry)
  const narrowed = categories.filter((title) => {
    const text = normalize(title)
    return text.includes(place) || text.includes(country)
  })
  const pool = narrowed.length ? narrowed : categories
  return pool.sort((left, right) => left.length - right.length)[0]
}

async function filesInCategory(title) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'categorymembers',
    cmtitle: title,
    cmtype: 'file',
    cmlimit: '40',
    format: 'json',
    origin: '*',
  })
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`)
  return (data.query?.categorymembers ?? [])
    .map((page) => page.title)
    .filter((name) => !badFile.test(name))
}

const GENERIC_NAME = new Set(['tower', 'bridge', 'palace', 'temple', 'castle', 'mosque', 'church', 'cathedral', 'mountain', 'statue', 'building', 'house', 'gate', 'great', 'saint', 'mount', 'rock', 'wall', 'blue', 'city', 'royal', 'grand', 'national'])

function subjectTokens(seed) {
  const words = normalize(seed.enName).split(/[^a-z0-9]+/).filter((word) => word.length >= 4 && !GENERIC_NAME.has(word))
  if (words.length) return words
  return normalize(seed.enName).split(/[^a-z0-9]+/).filter((word) => word.length >= 3)
}

function scoreFile(title, seed) {
  const text = normalize(title)
  const tokens = subjectTokens(seed)
  const phrase = normalize(seed.enName).replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()
  const hits = tokens.filter((token) => text.includes(token))
  const named = (phrase.length >= 4 && text.includes(phrase))
    || (tokens.length === 1 && hits.length === 1)
    || (tokens.length >= 2 && hits.length >= Math.min(2, tokens.length))
  if (!named) return -100
  let score = 6
  if (aerialWord.test(text) || /desde el cielo|aus der luft|luftaufnahme/.test(text)) score += 8
  if (/skyhawk|blue angel|red arrow|f-15|fighter|crypt|not a drone|from the top|lakenheath|flyby|fly by|army plane/.test(text)) score -= 25
  if (/skyline of|photograph of sydney|photograph of cape town|of paris |of singapore|of toronto|midtown|historical peninsula/.test(text)) score -= 12
  return score
}

function bestTitles(titles, seed, minimum = 6) {
  const ranked = titles
    .map((title) => ({ title, score: scoreFile(title, seed) }))
    .filter((hit) => hit.score >= minimum)
    .sort((left, right) => right.score - left.score)
  const aerial = ranked.filter((hit) => hit.score >= 14)
  return (aerial.length ? aerial : ranked).slice(0, 6).map((hit) => hit.title)
}

async function searchTitles(query) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: `${query} filetype:bitmap`,
    srnamespace: '6',
    srlimit: '12',
    format: 'json',
    origin: '*',
  })
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`)
  return (data.query?.search ?? []).map((hit) => hit.title)
}

async function geoTitles(seed) {
  const point = coords[seed.q]
  for (const radius of [800, 3000, 10000]) {
    const params = new URLSearchParams({
      action: 'query',
      list: 'geosearch',
      gscoord: `${point.lat}|${point.lon}`,
      gsradius: String(radius),
      gslimit: '40',
      gsnamespace: '6',
      format: 'json',
      origin: '*',
    })
    const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`)
    const aerial = (data.query?.geosearch ?? [])
      .filter((hit) => aerialWord.test(hit.title) && !badFile.test(hit.title))
      .sort((left, right) => left.dist - right.dist)
    if (aerial.length) return aerial.map((hit) => hit.title)
    await sleep(400)
  }
  return []
}

async function resolveImage(titles) {
  for (const batch of chunks(titles.slice(0, 6), 3)) {
    const infoParams = new URLSearchParams({
      action: 'query',
      titles: batch.join('|'),
      prop: 'imageinfo',
      iiprop: 'url|mime|extmetadata',
      iiurlwidth: '1400',
      format: 'json',
      origin: '*',
    })
    const info = await fetchJson(`https://commons.wikimedia.org/w/api.php?${infoParams}`)
    const pages = Object.values(info.query?.pages ?? {})
    for (const title of batch) {
      const page = pages.find((candidate) => candidate.title === title)
      const image = page?.imageinfo?.[0]
      if (image?.thumburl?.startsWith('https://') && image.descriptionurl?.startsWith('https://')
        && /^image\/(jpeg|png|webp|tiff)$/.test(image.mime ?? '')) {
        return page
      }
    }
  }
  return null
}

const pinned = {
  Q243: 'Aerial view of Eiffel Tower and Exposition Universelle, Paris, 1889.jpg',
  Q9202: 'Aerial photograph of New York Harbor-Statue of Liberty-Ellis Island-Jersey City.jpg',
  Q10285: 'Aerial View Of The Colosseum Rome Italy Aerial Photography (151212315).jpeg',
  Q9141: 'Aerial View of Taj Mahal by Helicopter.png',
  Q37200: 'Great-Pyramids-of-Giza-Aerial-View-Cairo-Egypt.jpg',
  Q45178: 'Sydney (AU), Opera House -- 2019 -- 2896.jpg',
  Q79961: 'Aerial view of the Statue of Christ the Redeemer.jpg',
  Q48435: 'Aerial view of La Sagrada Familia and Agbar Tower in Barcelona, Spain (51227306750).jpg',
  Q44440: 'Aerial photo of San Francisco Bay and Golden Gate Bridge and Golden Gate Park.jpg',
  Q12495: 'Burj dubai aerial closeup.jpg',
  Q39054: 'Italy - Pisa - Leaning Tower of Pisa - birds eye view.jpg',
  Q39671: 'Stonehenge and Aerodrome 1928.jpg',
  Q5788: 'Pétra. Vue aérienne des Jardins Romains.jpg',
  Q43473: 'Angkor Wat aerial view (7294722974).jpg',
  Q82425: 'Aerial view of the Brandenburg Gate in Berlin 1945-46 - panoramio.jpg',
  Q4152: 'Aerial image of Neuschwanstein Castle (view from the northwest).jpg',
  Q83497: 'Aerial view of Mount Rushmore National Memorial by Volkan Yuksel DSC04244.JPG',
  Q47476: 'Alhambra from above, 2008.jpg',
  Q80290: 'China (Beijing) Aerial view of Forbidden City (38884882275).jpg',
  Q5859: 'Chichen Itza Mexico aerial (20933043600).jpg',
  Q33910: 'Aerial View of Uluru - 2013.04 - panoramio.jpg',
  Q213360: 'Table Mountain from plane.JPG',
  Q134883: 'CN Tower aerial.JPG',
  Q9188: 'Empire State Building (aerial view).jpg',
  Q83125: 'Aerial view of Tower Bridge and HMS Belfast (2012) - panoramio.jpg',
  Q2981: 'Cathédrale Notre-Dame de Paris- vue aérienne 1 Archives nationales 20130290-10.jpg',
  Q64436: 'Aerial view of the Arc de Triomphe, Paris, France, ca. 1900.jpg',
  Q651388: 'Mont Saint-Michel aerial.png',
  Q212065: 'Edinburgh Castle - aerial - 2025-04-19 01.jpg',
  Q42798: 'COLLECTIE TROPENMUSEUM Luchtfoto van de Borobudur TMnr 10015636.jpg',
  Q272153: 'Asian cultures, Sigiriya - UNESCO - PHOTO0000002098 0001 An aerial view.jpg',
  Q188754: 'Himeji Castle Aerial photograph 2010.jpg',
  Q177549: 'Ifpo 23407 Syrie, gouvernorat de Homs, District de Talkalakh, le Krak des Chevaliers, vue aérienne de face.jpg',
  Q12506: 'Hagia Sophia Mars 2013.jpg',
  Q80541: 'Blue Mosque (The Sultan Ahmed Mosque) (8396648956) cropped.jpg',
  Q1424358: 'Aerial view of Madurai Meenakshi amman temple.jpg',
  Q548679: 'Aerial of Marina Bay Sands Hotel Singapore (36759639555).jpg',
  Q7971367: 'Bete Giyorgis Lalibela Ethiopia.jpg',
  Q181172: 'The-temple-of-the-jaguar.jpg',
  Q485727: 'Bagan-Ballonfahrt-220-Thatbyinnyu-Gawdawpalin-Ananda-gje.jpg',
  Q3448354: 'Ahu Tongariki quince moais.jpg',
  Q643098: 'ETH-BIB-Isfahan (grosse Moschee) aus 300 m Höhe-Persienflug 1924-1925-LBS MH02-02-0148-AL-FL.tif',
  Q133274: 'Kremlin birds eye view-1.jpg',
  Q191763: 'Itsukushima-jinja torii at sunset, Miyajima, Japan, 20240816 1812 4144.jpg',
  Q41346: 'Sunshine on mosque Hassan II in Casablanca, Morocco - Flickr - Milamber\'s portfolio.jpg',
  Q683632: 'Great Mosque of Djenné 1.jpg',
  Q695604: 'Sheikh Zayed Grand Mosque in Abu Dhabi - panoramio.jpg',
  Q71229: 'The Potala Palace 2007.JPG',
  Q1373583: 'RegistanSquare Samarkand.jpg',
  Q459629: 'Algérie - Timgad (lol0254).jpg',
  Q204871: 'Charles Bridge (Karlův most), Vltava River, Prague, 2015.jpg',
  Q131330: 'Schoenbrunn Castle (i.e. Schönbrunn) Vienna Austro-Hungary.jpg',
  Q676203: 'Machu Picchu Through Clouds (Unsplash).jpg',
  Q12501: 'Badaling landscape from Great Wall.jpg',
  Q41225: 'Big Ben & Houses of Parliament (Along The River Thames).jpg',
  Q131013: 'The Parthenon in Athens.jpg',
  Q129846: 'Храм Василия Блаженного.jpg',
  Q13397: 'Louvre Museum Wikimedia Commons.jpg',
  Q172613: 'Desde el cielo.JPG',
  Q1268562: 'Aerial view of Ellora Caves, Maharashtra.jpg',
  Q12512: 'Aerial shot of St. Peter\'s Basilica, the Vatican, Rome, by Fedele Azari (Getty 108JM1).jpg',
  Q99309: 'Pantheon Rom 1 cropped.jpg',
  Q4176: 'Cologne cathedral aerial (25326253726).jpg',
  Q2946: 'Water reflection of the Orangerie garden and Palace of Versailles with blue sky in France.jpg',
  Q62378: 'Aerial Tower of London.jpg',
  Q54495: 'Sydney Harbour Bridge from Circular Quay.jpg',
  Q83063: 'Petronas Twin Towers (230715-1406).jpg',
  Q42182: 'Buckingham Palace aerial view 2016.jpg',
  Q35525: 'Aerial view of the White House.jpg',
  Q18068: 'View west along Duomo roof, Milan.jpg',
  Q130958: 'Great Sphinx of Giza (2).jpg',
  Q39231: 'Mount Fuji at sunset, March 2025.jpg',
  Q180376: 'Hollywood Sign.jpg',
  Q11819: 'Budapest Parliament 4604.JPG',
  Q714828: 'KyotoFushimiInariLarge.jpg',
  Q270983: 'Kinkaku-ji the Golden Temple in Kyoto overlooking the lake - high rez.JPG',
  Q47672: 'Terracotta Army, View of Pit 1.jpg',
  Q125445: 'Hall of Prayer for Good Harvest.JPG',
  Q180422: 'Golden temple aerial shot in Amritsar.jpg',
  Q724970: 'Templo Wat Arun, Bangkok, Tailandia, 2013-08-22, DD 04.jpg',
  Q464535: 'Shwedagon Pagoda, Golden stupa, Yangon, Myanmar.jpg',
  Q47721: 'Yogyakarta Indonesia Prambanan-temple-complex-02.jpg',
  Q172077: 'Jerusalem-2013(2)-Temple Mount-Dome of the Rock (SE exposure).jpg',
  Q129072: '2018-09-21 Iran, Persepolis, Tachara (from the southeast).jpg',
  Q134140: 'Templo de Ramsés II, Abu Simbel, Egipto, 2022-04-02, DD 03.jpg',
  Q43278: 'Cataratas Victoria, Zambia-Zimbabue, 2018-07-27, DD 30-34 PAN.jpg',
  Q36332: 'The Iguaçu Falls with a rainbow in a sunny day.jpg',
  Q76122: 'Salar de Uyuni, Bolivia, 2016-02-04, DD 16-18 HDR.JPG',
  Q131354: 'Alcatraz Island aerial view.jpg',
  Q3125051: 'Meteora Monastery.jpg',
  Q752091: 'Konark Sun Temple Puri district, Odisha, India 3.jpg',
  Q205131: 'Leshan Giant Buddha, 20161102.jpg',
  Q654024: 'Angkor - Bayon - 004 Tower Faces (8581824754).jpg',
  Q2620036: 'Líneas de Nazca, Nazca, Perú, 2015-07-29, DD 52.JPG',
  Q2914326: 'Amphithéâtre d’El Jem vue aerienne (2023) 1.jpg',
  Q456939: 'Sudan Meroe Pyramids 2001.JPG',
  Q209217: 'Great Zimbabwe - aerial view.jpg',
  Q181427: 'Temple of the Inscriptions - Palenque Maya Site, Feb 2020.jpg',
  Q43286: 'Cave 96 of Mogao Grottoes (20230918151944).jpg',
  Q826551: 'Banaue Philippines Banaue-Rice-Terraces-01.jpg',
}

const images = {}
for (const seed of seeds) {
  let titles = pinned[seed.q] ? [`File:${pinned[seed.q]}`] : []
  if (!pinned[seed.q]) {
  const prefixes = [
    `Aerial photographs of the ${seed.enName}`,
    `Aerial photographs of ${seed.enName}`,
    `Aerial views of the ${seed.enName}`,
    `Aerial views of ${seed.enName}`,
  ]
  for (const prefix of prefixes) {
    const categories = await categoriesFor(prefix)
    if (categories.length) {
      const category = pickCategory(categories, prefix, seed)
      const ranked = bestTitles(await filesInCategory(category), seed)
      if (ranked.length) {
        titles = ranked
        console.error(`CAT ${seed.q} ${seed.name} <- ${category}`)
        break
      }
    }
    await sleep(250)
  }
  if (titles.length === 0) {
    for (const query of [seed.search, `aerial ${seed.enName}`]) {
      const ranked = bestTitles(await searchTitles(query), seed, 14)
      if (ranked.length) {
        titles = ranked
        console.error(`SEARCH ${seed.q} ${seed.name} <- ${ranked[0]}`)
        break
      }
      await sleep(400)
    }
  }
  if (titles.length === 0) {
    titles = bestTitles(await geoTitles(seed), seed, 14)
    if (titles.length) console.error(`GEO ${seed.q} ${seed.name} <- ${titles[0]}`)
  }
  }
  const page = titles.length ? await resolveImage(titles) : null
  if (!page) {
    console.error(`NO IMAGE ${seed.q} ${seed.name}`)
  } else {
    const image = page.imageinfo[0]
    const meta = image.extmetadata ?? {}
    images[seed.q] = {
      url: image.thumburl,
      pageUrl: image.descriptionurl,
      creator: stripHtml(meta.Artist?.value) || 'Unbekannte Urheberschaft',
      license: meta.LicenseShortName?.value || meta.UsageTerms?.value || 'Siehe Bildquelle',
      title: page.title,
    }
    console.error(`${seed.q} ${seed.name} <- ${page.title}`)
  }
  await sleep(350)
}

const missing = seeds.filter((seed) => !images[seed.q]).map((seed) => seed.q)
if (missing.length) {
  throw new Error(`Missing images: ${missing.join(', ')}`)
}

const quote = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const slug = (name) => name
  .normalize('NFD').replace(/\p{Diacritic}/gu, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const imageFile = `// Automatisch aus Wikimedia Commons erzeugt.\n`
  + `// Aktualisieren: node scripts/fetch-landmark-catalog.mjs\n`
  + `import type { Landmark } from '../domain/landmarkSchema'\n\n`
  + `export const landmarkImages: Record<string, Landmark['image']> = ${JSON.stringify(
    Object.fromEntries(Object.entries(images).map(([id, image]) => [id, {
      url: image.url,
      pageUrl: image.pageUrl,
      creator: image.creator,
      license: image.license,
    }])),
    null,
    2,
  )}\n`
await writeFile(new URL('../src/data/landmarkImages.generated.ts', import.meta.url), imageFile)

const lines = seeds.map((seed) => {
  const point = coords[seed.q]
  const aliases = `[${seed.aliases.map(quote).join(', ')}]`
  return `  [${quote(seed.q)}, ${quote(seed.name)}, ${aliases}, ${quote(seed.kind)}, ${quote(seed.feature)}, ${quote(seed.fact)}, ${quote(seed.difficulty)}, [${quote(seed.place)}, ${quote(seed.country)}, ${point.lon}, ${point.lat}]],`
})

const landmarksTs = `import { validateLandmarks, type Landmark } from '../domain/landmarkSchema'
import { landmarkImages } from './landmarkImages.generated'

type PlaceSeed = [name: string, country: string, longitude: number, latitude: number]
type LandmarkSeed = [
  wikidataId: string,
  name: string,
  aliases: string[],
  kind: string,
  feature: string,
  fact: string,
  difficulty: Landmark['difficulty'],
  place: PlaceSeed,
]

const slug = (name: string) => name
  .normalize('NFD').replace(/\\p{Diacritic}/gu, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const seeds: LandmarkSeed[] = [
${lines.join('\n')}
]

const catalogInput: Landmark[] = seeds.map(([
  wikidataId, name, aliases, kind, feature, fact, difficulty, place,
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
  hints: [kind, feature, fact],
  summary: fact,
  sources: [{ label: 'Wikidata', url: \`https://www.wikidata.org/wiki/\${wikidataId}\` }],
  image: landmarkImages[wikidataId],
}))

export const landmarks = validateLandmarks(catalogInput)
`
await writeFile(new URL('../src/data/landmarks.ts', import.meta.url), landmarksTs)

const translations = seeds.map((seed) => {
  const id = slug(seed.name)
  return `  '${id}': {
    hints: [${JSON.stringify(seed.enKind)}, ${JSON.stringify(seed.enFeature)}, ${JSON.stringify(seed.enFact)}],
    summary: ${JSON.stringify(seed.enFact)},
    place: { name: ${JSON.stringify(seed.enPlace)}, country: ${JSON.stringify(seed.enCountry)} },
  },`
})
const names = seeds
  .filter((seed) => seed.enName !== seed.name)
  .map((seed) => `  ${seed.q}: ${JSON.stringify(seed.enName)},`)

const enFile = `export interface EnglishLandmarkTranslation {
  hints: [string, string, string]
  summary: string
  place: { name: string; country: string }
}

export const englishLandmarkTranslations: Record<string, EnglishLandmarkTranslation> = {
${translations.join('\n')}
}

export const englishLandmarkNames: Record<string, string> = {
${names.join('\n')}
}
`
await writeFile(new URL('../src/data/landmarkTranslations.en.ts', import.meta.url), enFile)
console.log(`wrote ${seeds.length} landmarks, ${Object.keys(images).length} images`)
