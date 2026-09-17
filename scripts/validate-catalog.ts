import { people } from '../src/data/people'
import { englishPersonTranslations } from '../src/data/peopleTranslations.en'

const errors: string[] = []

if (people.length < 100) {
  errors.push(`Der Katalog muss mindestens 100 Personen enthalten (aktuell ${people.length}).`)
}

const wikidataIds = new Set<string>()
for (const person of people) {
  if (wikidataIds.has(person.wikidataId)) {
    errors.push(`Doppelte Wikidata-ID: ${person.wikidataId}`)
  }
  wikidataIds.add(person.wikidataId)

  const english = englishPersonTranslations[person.id]
  if (!english) {
    errors.push(`Englische Übersetzung fehlt: ${person.id}`)
  } else if (
    english.hints.some((hint) => !hint.trim())
    || !english.summary.trim()
    || !english.birth.name.trim()
    || !english.birth.country.trim()
    || !english.death.name.trim()
    || !english.death.country.trim()
  ) {
    errors.push(`Englische Übersetzung ist unvollständig: ${person.id}`)
  }

  if (person.birth.coordinates[0] === person.death.coordinates[0]
    && person.birth.coordinates[1] === person.death.coordinates[1]) {
    console.warn(`Hinweis: Marker überlappen bei ${person.name}.`)
  }
}

const knownIds = new Set(people.map((person) => person.id))
for (const id of Object.keys(englishPersonTranslations)) {
  if (!knownIds.has(id)) errors.push(`Übersetzung ohne Person: ${id}`)
}

for (const difficulty of ['easy', 'medium', 'hard'] as const) {
  const count = people.filter((person) => person.difficulty === difficulty).length
  if (count < 10) errors.push(`Zu wenige Datensätze mit Schwierigkeit „${difficulty}“: ${count}`)
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Katalog geprüft: ${people.length} Personen, ${wikidataIds.size} eindeutige Quellen-IDs.`)
