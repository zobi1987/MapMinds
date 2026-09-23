import { z } from 'zod'
import type { Difficulty } from './personSchema'

const httpsUrlSchema = z.url().refine(
  (value) => new URL(value).protocol === 'https:',
  'Nur HTTPS-URLs sind erlaubt.',
)

export const citySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  wikidataId: z.string().regex(/^Q\d+$/),
  name: z.string().min(3),
  aliases: z.array(z.string().min(2)).default([]),
  place: z.object({
    name: z.string().min(2),
    country: z.string().min(2),
    coordinates: z.tuple([
      z.number().min(-180).max(180),
      z.number().min(-90).max(90),
    ]),
  }),
  hints: z.tuple([
    z.string().min(4),
    z.string().min(8),
    z.string().min(2),
  ]),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  summary: z.string().min(20),
  sources: z.array(z.object({
    label: z.string().min(2),
    url: httpsUrlSchema,
  })).min(1),
  image: z.object({
    url: httpsUrlSchema,
    pageUrl: httpsUrlSchema,
    creator: z.string().min(1),
    license: z.string().min(1),
  }),
})

export type City = z.infer<typeof citySchema>
export type CityDifficulty = Difficulty

export function validateCities(input: unknown): City[] {
  const catalog = z.array(citySchema).min(99).parse(input)
  const ids = new Set<string>()
  const names = new Set<string>()
  const wikidataIds = new Set<string>()

  for (const city of catalog) {
    if (ids.has(city.id)) throw new Error(`Doppelte ID: ${city.id}`)
    ids.add(city.id)
    if (wikidataIds.has(city.wikidataId)) throw new Error(`Doppelte Wikidata-ID: ${city.wikidataId}`)
    wikidataIds.add(city.wikidataId)
    const normalizedName = city.name.toLocaleLowerCase('de')
    if (names.has(normalizedName)) throw new Error(`Doppelter Name: ${city.name}`)
    names.add(normalizedName)
  }

  return catalog
}
