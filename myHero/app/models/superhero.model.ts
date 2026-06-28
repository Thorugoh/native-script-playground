export interface SuperHeroImage {
  url: string
}

export interface SuperHeroBiography {
  'full-name': string
  'alter-egos': string
  aliases: string[]
  'place-of-birth': string
  'first-appearance': string
  publisher: string
  alignment: string
}

export interface SuperHeroResult {
  id: string
  name: string
  image: SuperHeroImage
  biography: SuperHeroBiography
}

export interface SuperHeroSearchResponse {
  response: 'success' | 'error'
  'results-for'?: string
  error?: string
  results?: SuperHeroResult[]
}

// Flattened biography for the UI. The API uses hyphenated keys (e.g. "full-name"),
// which are awkward for XML binding, so we expose camelCase fields here.
export interface HeroBiography {
  fullName: string
  alterEgos: string
  aliases: string
  placeOfBirth: string
  firstAppearance: string
  publisher: string
  alignment: string
}

export interface Hero {
  id: string
  name: string
  description: string
  imageUrl: string
  biography: HeroBiography
}

// SuperHero API image URLs point to superherodb.com, which sits behind Cloudflare
// and returns 403 to non-browser clients (including NativeScript's <Image>).
// The akabab/superhero-api dataset hosts the same images, keyed by the same id,
// on an open CDN (jsDelivr), so we build the URL from id + name instead.
const IMAGE_CDN = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md'

function imageUrlFor(id: string, name: string): string {
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-')
  return `${IMAGE_CDN}/${id}-${slug}.jpg`
}

function toBiography(b: SuperHeroBiography): HeroBiography {
  return {
    fullName: b['full-name'],
    alterEgos: b['alter-egos'],
    aliases: Array.isArray(b.aliases) ? b.aliases.join(', ') : '',
    placeOfBirth: b['place-of-birth'],
    firstAppearance: b['first-appearance'],
    publisher: b.publisher,
    alignment: b.alignment,
  }
}

export function toHero(r: SuperHeroResult): Hero {
  const fullName = r.biography['full-name']
  const publisher = r.biography.publisher
  const parts = [fullName, publisher].filter((p) => p && p.trim().length > 0)

  return {
    id: r.id,
    name: r.name,
    description: parts.length ? parts.join(' · ') : 'No info available.',
    imageUrl: imageUrlFor(r.id, r.name),
    biography: toBiography(r.biography),
  }
}
