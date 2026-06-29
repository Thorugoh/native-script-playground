import { Observable } from '@nativescript/core'
import { Hero } from '../models/superhero.model'
import { shareText } from '../utils/share'

export class DetailsViewModel extends Observable {
  private _hero: Hero

  constructor(hero: Hero) {
    super()
    this._hero = hero
  }

  get hero(): Hero {
    return this._hero
  }

  // Opens the platform's native share sheet (UIActivityViewController / Intent.ACTION_SEND).
  share() {
    const h = this._hero
    shareText(`Check out ${h.name} (${h.biography.fullName}) — ${h.biography.publisher}`)
  }
}
