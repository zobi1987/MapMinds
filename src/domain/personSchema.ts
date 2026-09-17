import { z } from 'zod'

const httpsUrlSchema = z.url().refine(
  (value) => new URL(value).protocol === 'https:',
  'Nur HTTPS-URLs sind erlaubt.',
)

export const locationSchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2),
  year: z.number().int().min(-3000).max(new Date().getFullYear()),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
  ]),
})

export const portraitSchema = z.object({
  url: httpsUrlSchema,
  pageUrl: httpsUrlSchema,
  creator: z.string().min(1),
  license: z.string().min(1),
}).optional()

export const personSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  wikidataId: z.string().regex(/^Q\d+$/),
  name: z.string().min(3),
  aliases: z.array(z.string().min(2)).default([]),
  birth: locationSchema,
  death: locationSchema,
  hints: z.tuple([
    z.string().min(4),
    z.string().min(4),
    z.string().min(8),
  ]),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  category: z.string().min(3),
  summary: z.string().min(20),
  sources: z.array(z.object({
    label: z.string().min(2),
    url: httpsUrlSchema,
  })).min(1),
  portrait: portraitSchema,
})

export type Person = z.infer<typeof personSchema>
export type Difficulty = Person['difficulty']

export function validateCatalog(input: unknown): Person[] {
  const catalog = z.array(personSchema).min(10).parse(input)
  const ids = new Set<string>()
  const names = new Set<string>()
  const wikidataIds = new Set<string>()

  for (const person of catalog) {
    if (ids.has(person.id)) throw new Error(`Doppelte ID: ${person.id}`)
    ids.add(person.id)

    if (wikidataIds.has(person.wikidataId)) {
      throw new Error(`Doppelte Wikidata-ID: ${person.wikidataId}`)
    }
    wikidataIds.add(person.wikidataId)

    const normalizedName = person.name.toLocaleLowerCase('de')
    if (names.has(normalizedName)) {
      throw new Error(`Doppelter Name: ${person.name}`)
    }
    names.add(normalizedName)

    if (person.birth.year > person.death.year) {
      throw new Error(`Ungültige Lebensdaten: ${person.name}`)
    }
  }

  return catalog
}
