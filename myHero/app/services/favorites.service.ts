import { ApplicationSettings } from '@nativescript/core'
import { Hero } from '../models/superhero.model'

const STORAGE_KEY = 'favoriteHeroes'

// Persistent store of favorited heroes, shared across tabs.
// In-memory Map is the working copy; ApplicationSettings is the persistent backing
// (NSUserDefaults on iOS, SharedPreferences on Android).
export class FavoritesService {
  private static _instance: FavoritesService = new FavoritesService()
  private _heroes = new Map<string, Hero>()

  private constructor() {
    this.load()
  }

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
    let favorite: boolean
    if (this._heroes.has(hero.id)) {
      this._heroes.delete(hero.id)
      favorite = false
    } else {
      this._heroes.set(hero.id, { ...hero, favorite: true })
      favorite = true
    }
    this.save()
    return favorite
  }

  private load(): void {
    const raw = ApplicationSettings.getString(STORAGE_KEY, '[]')
    try {
      const heroes = JSON.parse(raw) as Hero[]
      this._heroes = new Map(heroes.map((hero) => [hero.id, hero]))
    } catch {
      this._heroes = new Map()
    }
  }

  private save(): void {
    ApplicationSettings.setString(STORAGE_KEY, JSON.stringify([...this._heroes.values()]))
  }
}
