import { EventData, ItemEventData, Observable, ObservableArray, SearchBar, View } from '@nativescript/core'
import { Hero } from './models/superhero.model'
import { FavoritesService } from './services/favorites.service'
import { SuperHeroService } from './services/superhero.service'
import { pulse } from './utils/animations'

export class HelloWorldModel extends Observable {
  private _search = ''
  private _heroes = new ObservableArray<Hero>()
  private _loading = false
  private _error = ''
  private _favorites = FavoritesService.getInstance()

  constructor() {
    super()
  }

  get search(): string {
    return this._search
  }

  set search(value: string) {
    if (this._search !== value) {
      this._search = value
      this.notifyPropertyChange('search', value)
    }
  }

  get heroes(): ObservableArray<Hero> {
    return this._heroes
  }

  // Re-sync each row's favorite flag with the shared service (e.g. after the
  // Favorites tab unfavorited something). Called when this tab becomes active.
  refreshFavorites() {
    for (let i = 0; i < this._heroes.length; i++) {
      const hero = this._heroes.getItem(i)
      const favorite = this._favorites.isFavorite(hero.id)
      if (hero.favorite !== favorite) {
        this._heroes.setItem(i, { ...hero, favorite })
      }
    }
  }

  get loading(): boolean {
    return this._loading
  }

  set loading(value: boolean) {
    if (this._loading !== value) {
      this._loading = value
      this.notifyPropertyChange('loading', value)
    }
  }

  get error(): string {
    return this._error
  }

  set error(value: string) {
    if (this._error !== value) {
      this._error = value
      this.notifyPropertyChange('error', value)
    }
  }

  // Bound to the SearchBar submit event in the XML.
  async onSearch(args: EventData) {
    const term = (args.object as SearchBar).text
    this.search = term
    await this.runSearch(term)
  }

  // Bound to the ListView itemTap event in the XML.
  onHeroTap(args: ItemEventData) {
    const listView = args.object as View
    listView.page.frame.navigate({
      moduleName: 'details/details-page',
      context: this._heroes.getItem(args.index),
    })
  }

  // Bound to the favorite icon tap in the item template.
  // Replacing the item via setItem notifies the ObservableArray, so only this row re-renders.
  toggleFavorite(args: EventData) {
    const icon = args.object as View
    const hero = icon.bindingContext as Hero
    const index = this._heroes.indexOf(hero)
    if (index < 0) return

    const favorite = this._favorites.toggle(hero)
    // Pulse the tapped icon first, then swap the row so the new state appears after.
    pulse(icon).then(() => this._heroes.setItem(index, { ...hero, favorite }))
  }

  private async runSearch(term: string) {
    this._heroes.splice(0)

    if (!term || !term.trim()) {
      return
    }

    this.loading = true
    this.error = ''
    try {
      const results = await SuperHeroService.getInstance().searchHeroes(term)
      const withFavorites = results.map((hero) => ({
        ...hero,
        favorite: this._favorites.isFavorite(hero.id),
      }))
      this._heroes.push(...withFavorites)
    } catch (err) {
      this.error = 'Failed to load heroes.'
      console.error('Hero search failed:', err)
    } finally {
      this.loading = false
    }
  }
}
