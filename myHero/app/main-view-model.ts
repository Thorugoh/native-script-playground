import { Frame, ItemEventData, Observable, SearchBar } from '@nativescript/core'
import { Hero } from './models/superhero.model'
import { SuperHeroService } from './services/superhero.service'

export class HelloWorldModel extends Observable {
  private _search = ''
  private _heroes: Hero[] = []
  private _loading = false
  private _error = ''

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

  get heroes(): Hero[] {
    return this._heroes
  }

  set heroes(value: Hero[]) {
    this._heroes = value
    this.notifyPropertyChange('heroes', value)
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
      context: this._heroes[args.index],
    })
  }

  private async runSearch(term: string) {
    if (!term || !term.trim()) {
      this.heroes = []
      return
    }

    this.loading = true
    this.error = ''
    try {
      this.heroes = await SuperHeroService.getInstance().searchHeroes(term)
    } catch (err) {
      this.error = 'Failed to load heroes.'
      this.heroes = []
      console.error('Hero search failed:', err)
    } finally {
      this.loading = false
    }
  }
}
