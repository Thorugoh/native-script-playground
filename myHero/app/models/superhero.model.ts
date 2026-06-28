// Tipos da SuperHero API (https://superheroapi.com).
// Busca: GET https://superheroapi.com/api/{TOKEN}/search/{name}

export interface SuperHeroImage {
  url: string
}

export interface SuperHeroBiography {
  'full-name': string
  publisher: string
  alignment: string
}

// Item bruto retornado pela API (campos parciais — só o que usamos).
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

// Modelo "achatado" que o ViewModel/UI consomem.
export interface Hero {
  id: string
  name: string
  description: string
  imageUrl: string
}

// A URL de imagem da SuperHero API aponta para superherodb.com, que está atrás
// de Cloudflare (responde 403 "Just a moment..." para clientes não-navegador,
// incluindo o <Image> do NativeScript). O dataset open-source akabab/superhero-api
// hospeda AS MESMAS imagens, indexadas pelo MESMO id, num CDN aberto (jsDelivr).
// Montamos a URL a partir do id + nome em vez de usar r.image.url.
const IMAGE_CDN = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md'

function imageUrlFor(id: string, name: string): string {
  // Slug usado pelo dataset: lowercase, espaços → '-', hifens preservados.
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-')
  return `${IMAGE_CDN}/${id}-${slug}.jpg`
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
  }
}
