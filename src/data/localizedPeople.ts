import type { Language } from '../i18n'
import type { Person } from '../domain/personSchema'
import { englishPersonTranslations } from './peopleTranslations.en'

const englishDisplayNames: Partial<Record<string, string>> = {
  Q635: 'Cleopatra VII',
  Q7207: 'Elizabeth I',
  Q9439: 'Queen Victoria',
  Q30547: 'Mother Teresa',
  Q7226: 'Joan of Arc',
  Q36450: 'Catherine the Great',
  Q8479: 'Peter the Great',
  Q1048: 'Julius Caesar',
  Q1430: 'Marcus Aurelius',
  Q8409: 'Alexander the Great',
  Q4604: 'Confucius',
  Q1394: 'Vladimir Lenin',
  Q855: 'Joseph Stalin',
  Q7243: 'Leo Tolstoy',
  Q991: 'Fyodor Dostoevsky',
  Q7200: 'Alexander Pushkin',
  Q7302: 'George Frideric Handel',
  Q7315: 'Pyotr Ilyich Tchaikovsky',
  Q7327: 'Yuri Gagarin',
  Q9682: "Elizabeth II",
  Q30487: "Mikhail Gorbachev",
  Q42013: "Anwar Sadat",
  Q129234: "Hatshepsut",
  Q720: "Genghis Khan",
  Q7192: "Qin Shi Huang",
  Q43347: "Rumi",
  Q8011: "Avicenna",
  Q619: "Nicolaus Copernicus",
  Q913: "Socrates",
  Q868: "Aristotle",
  Q859: "Plato",
  Q5597: "Raphael",
  Q41264: "Johannes Vermeer",
  Q5432: "Francisco Goya",
}

export function localizePerson(person: Person, language: Language): Person {
  if (language === 'de') return person

  const translation = englishPersonTranslations[person.id]
  if (!translation) return person

  return {
    ...person,
    name: englishDisplayNames[person.wikidataId] ?? person.name,
    aliases: [...person.aliases, person.name],
    category: translation.category,
    hints: translation.hints,
    summary: translation.summary,
    birth: {
      ...person.birth,
      name: translation.birth.name,
      country: translation.birth.country,
    },
    death: {
      ...person.death,
      name: translation.death.name,
      country: translation.death.country,
    },
  }
}
