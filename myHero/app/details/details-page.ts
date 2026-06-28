import { EventData, Page } from '@nativescript/core'
import { Hero } from '../models/superhero.model'
import { DetailsViewModel } from './details-view-model'

export function navigatingTo(args: EventData) {
  const page = <Page>args.object
  page.bindingContext = new DetailsViewModel(page.navigationContext as Hero)
}
