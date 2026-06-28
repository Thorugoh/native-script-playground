import { EventData, Frame, ItemEventData, Observable, ObservableArray, SearchBar, View } from '@nativescript/core'
import { Hero } from './models/superhero.model'
import { SuperHeroService } from './services/superhero.service'

export class HelloWorldModel extends Observable {
  private _search = ''
  private _heroes = new ObservableArray<Hero>()
  private _loading = false
  private _error = ''

  constructor() {
    super()
    this.toggleFavorite = this.toggleFavorite.bind(this)
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
  async onSearch(args: { object: SearchBar }) {
    const term = args.object.text
    this.search = term
    await this.runSearch(term)
  }

  // Bound to the ListView itemTap event in the XML.
  onHeroTap(args: ItemEventData) {
    Frame.topmost().navigate({
      moduleName: 'details/details-page',
      context: this._heroes.getItem(args.index),
    })
  }

  // Bound to the favorite icon tap in the item template.
  // Replacing the item via setItem notifies the ObservableArray, so only this row re-renders.
  toggleFavorite(args: EventData) {
    const hero = (args.object as View).bindingContext as Hero
    const index = this._heroes.indexOf(hero)
    if (index < 0) return
    this._heroes.setItem(index, { ...hero, favorite: !hero.favorite })
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
      this._heroes.push(...results)
    } catch (err) {
      this.error = 'Failed to load heroes.'
      console.error('Hero search failed:', err)
    } finally {
      this.loading = false
    }
  }
}
