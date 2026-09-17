import type { Person } from './personSchema'

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('de')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/[-\s]+/g, ' ')
    .trim()
}

function distanceAtMostOne(left: string, right: string): boolean {
  if (left === right) return true
  if (Math.abs(left.length - right.length) > 1) return false

  let edits = 0
  let i = 0
  let j = 0
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      i += 1
      j += 1
      continue
    }
    edits += 1
    if (edits > 1) return false
    if (
      left.length === right.length
      && left[i] === right[j + 1]
      && left[i + 1] === right[j]
    ) {
      i += 2
      j += 2
      continue
    }
    if (left.length > right.length) i += 1
    else if (right.length > left.length) j += 1
    else {
      i += 1
      j += 1
    }
  }
  return edits + Number(i < left.length || j < right.length) <= 1
}

function acceptedNames(person: Person, catalog: Person[]): string[] {
  const fullName = normalizeAnswer(person.name)
  const surname = fullName.split(' ').at(-1) ?? fullName
  const surnameIsUnique = catalog.filter((candidate) => {
    const candidateName = normalizeAnswer(candidate.name)
    return candidateName === surname
      || candidateName.split(' ').at(-1) === surname
      || candidate.aliases.map(normalizeAnswer).includes(surname)
  }).length === 1
  const uniqueAliases = person.aliases
    .map(normalizeAnswer)
    .filter((alias) => catalog.filter((candidate) => {
      const candidateName = normalizeAnswer(candidate.name)
      const candidateSurname = candidateName.split(' ').at(-1)
      return candidateName === alias
        || candidateSurname === alias
        || candidate.aliases.map(normalizeAnswer).includes(alias)
    }).length === 1)

  return [
    fullName,
    ...uniqueAliases,
    ...(surnameIsUnique ? [surname] : []),
  ]
}

export function isAcceptedAnswer(
  answer: string,
  person: Person,
  catalog: Person[],
): boolean {
  const normalized = normalizeAnswer(answer)
  if (normalized.length < 3) return false

  return acceptedNames(person, catalog).some((candidate) => {
    if (candidate === normalized) return true
    return candidate.length >= 6 && normalized.length >= 6
      && distanceAtMostOne(candidate, normalized)
  })
}
