import { Hero } from '../models/superhero.model'

// In-memory store of favorited heroes, shared across tabs.
// Will be backed by persistent storage in a later step.
export class FavoritesService {
  private static _instance: FavoritesService = new FavoritesService()
  private _heroes = new Map<string, Hero>()

  static getInstance(): FavoritesService {
    return FavoritesService._instance
  }

  isFavorite(id: string): boolean {
    return this._heroes.has(id)
  }

  getAll(): Hero[] {
    return [...this._heroes.values()]
  }

  // Returns the new favorite state for the given hero.
  toggle(hero: Hero): boolean {
    if (this._heroes.has(hero.id)) {
      this._heroes.delete(hero.id)
      return false
    }
    this._heroes.set(hero.id, { ...hero, favorite: true })
    return true
  }
}
