import { CoreTypes, EventData, Observable, ObservableArray, View } from '@nativescript/core'
import { Hero } from '../models/superhero.model'
import { FavoritesService } from '../services/favorites.service'

export class FavoritesViewModel extends Observable {
  private _heroes = new ObservableArray<Hero>()
  private _favorites = FavoritesService.getInstance()

  constructor() {
    super()
    this.removeFavorite = this.removeFavorite.bind(this)
    this.reload()
  }

  get heroes(): ObservableArray<Hero> {
    return this._heroes
  }

  get isEmpty(): boolean {
    return this._heroes.length === 0
  }

  // Re-read favorites from the shared service (called when the tab appears).
  reload() {
    this._heroes.splice(0)
    this._heroes.push(...this._favorites.getAll())
    this.notifyPropertyChange('isEmpty', this.isEmpty)
  }

  // Bound to the card tap in the XML.
  onHeroTap(args: EventData) {
    const view = args.object as View
    view.page.frame.navigate({
      moduleName: 'details/details-page',
      context: view.bindingContext as Hero,
    })
  }

  // Bound to the heart tap in the XML.
  removeFavorite(args: EventData) {
    const icon = args.object as View
    const hero = icon.bindingContext as Hero

    // Shrink + fade the card out, then drop it from the list.
    icon
      .animate({
        scale: { x: 0, y: 0 },
        opacity: 0,
        duration: 220,
        curve: CoreTypes.AnimationCurve.easeIn,
      })
      .then(() => {
        this._favorites.toggle(hero)
        const index = this._heroes.indexOf(hero)
        if (index >= 0) {
          this._heroes.splice(index, 1)
        }
        this.notifyPropertyChange('isEmpty', this.isEmpty)
      })
  }
}
