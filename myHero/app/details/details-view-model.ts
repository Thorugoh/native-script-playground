import { Observable } from '@nativescript/core'
import { Hero } from '../models/superhero.model'

export class DetailsViewModel extends Observable {
  private _hero: Hero

  constructor(hero: Hero) {
    super()
    this._hero = hero
  }

  get hero(): Hero {
    return this._hero
  }
}
