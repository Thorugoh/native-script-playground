import { Http } from '@nativescript/core'
import { Hero, SuperHeroSearchResponse, toHero } from '../models/superhero.model'

const BASE_URL = 'https://superheroapi.com/api'

// Generate your token at https://superheroapi.com (sign in with GitHub).
const ACCESS_TOKEN = 'REDACTED_SUPERHERO_TOKEN'

export class SuperHeroService {
  private static _instance: SuperHeroService = new SuperHeroService()

  static getInstance(): SuperHeroService {
    return SuperHeroService._instance
  }

  async searchHeroes(name: string): Promise<Hero[]> {
    const term = name.trim()
    if (!term) return []

    const url = `${BASE_URL}/${ACCESS_TOKEN}/search/${encodeURIComponent(term)}`
    const res = await Http.getJSON<SuperHeroSearchResponse>(url)

    // The API returns response:"error" when there are no matches, not a network failure.
    if (res.response !== 'success' || !res.results) {
      return []
    }
    return res.results.map(toHero)
  }
}
