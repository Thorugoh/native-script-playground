import { Http } from '@nativescript/core'
import { Hero, SuperHeroSearchResponse, toHero } from '../models/superhero.model'

const BASE_URL = 'https://superheroapi.com/api'

// Token da SuperHero API — gere o seu em https://superheroapi.com (login com GitHub).
// Auth simples: o token vai direto na URL. Sem ts/hash (MD5 não é mais necessário).
const ACCESS_TOKEN = 'REDACTED_SUPERHERO_TOKEN'

/**
 * Service singleton — unica camada que conhece a SuperHero API.
 * O ViewModel chama SuperHeroService.getInstance().searchHeroes(...), nunca o Http direto.
 */
export class SuperHeroService {
  private static _instance: SuperHeroService = new SuperHeroService()

  static getInstance(): SuperHeroService {
    return SuperHeroService._instance
  }

  async searchHeroes(name: string): Promise<Hero[]> {
    const term = name.trim()
    if (!term) return []

    const url = `${BASE_URL}/${ACCESS_TOKEN}/search/${encodeURIComponent(term)}`
    console.log({url});
    
    const res = await Http.getJSON<SuperHeroSearchResponse>(url)
    console.log({res});
    
    // A API retorna response:"error" quando não há resultados — não é uma falha de rede.
    if (res.response !== 'success' || !res.results) {
      
      return []
    }
    return res.results.map(toHero)
  }
}
