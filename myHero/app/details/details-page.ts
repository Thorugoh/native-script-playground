import { EventData, Page, View } from '@nativescript/core'
import { Hero } from '../models/superhero.model'
import { DetailsViewModel } from './details-view-model'

export function navigatingTo(args: EventData) {
  const page = <Page>args.object
  page.bindingContext = new DetailsViewModel(page.navigationContext as Hero)
}

export function onShare(args: EventData) {
  const vm = (args.object as View).page.bindingContext as DetailsViewModel
  vm.share()
}
