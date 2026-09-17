import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../src/data/people.ts', import.meta.url), 'utf8')
const records = [...source.matchAll(/\['(Q\d+)',\s*'([^']+)'/g)]
  .map(([, id, name]) => ({ id, name }))

const normalize = (value) => value.normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '')

const mismatches = []
for (let start = 0; start < records.length; start += 50) {
  const batch = records.slice(start, start + 50)
  const params = new URLSearchParams({
    action: 'wbgetentities',
    ids: batch.map(({ id }) => id).join('|'),
    props: 'labels',
    format: 'json',
    origin: '*',
  })
  const response = await fetch(`https://www.wikidata.org/w/api.php?${params}`)
  if (!response.ok) throw new Error(`Wikidata antwortete mit ${response.status}`)
  const data = await response.json()

  for (const record of batch) {
    const entity = data.entities[record.id]
    const labels = Object.values(entity?.labels ?? {}).map(({ value }) => value)
    const label = labels.find((value) => normalize(value) === normalize(record.name))
      ?? entity?.labels?.de?.value
      ?? entity?.labels?.en?.value
    const expected = normalize(record.name)
    const actual = normalize(label ?? '')
    const surname = normalize(record.name.split(' ').at(-1))
    const anyLabelMatches = labels.some((value) => {
      const normalized = normalize(value)
      return normalized.includes(surname) || expected.includes(normalized)
    })
    if (!label || (!anyLabelMatches && !actual.includes(surname) && !expected.includes(actual))) {
      mismatches.push(`${record.id}: „${record.name}“ ↔ „${label ?? 'fehlt'}“`)
    }
  }
}

if (mismatches.length) {
  console.error(mismatches.join('\n'))
  console.error('\nMögliche Treffer:')
  for (const mismatch of mismatches) {
    const name = mismatch.match(/„([^“]+)“/)?.[1]
    if (!name) continue
    const params = new URLSearchParams({
      action: 'wbsearchentities',
      search: name,
      language: 'de',
      uselang: 'de',
      type: 'item',
      limit: '2',
      format: 'json',
      origin: '*',
    })
    const response = await fetch(`https://www.wikidata.org/w/api.php?${params}`)
    const data = await response.json()
    console.error(`${name}: ${data.search?.map((item) => `${item.id} ${item.label}`).join(' | ')}`)
  }
  process.exit(1)
}
console.log(`${records.length} Wikidata-IDs stimmen mit den kuratierten Namen überein.`)
