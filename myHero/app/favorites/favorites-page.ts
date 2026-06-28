import { EventData, NavigatedData, Page, View } from '@nativescript/core'
import { FavoritesViewModel } from './favorites-view-model'

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  let vm = page.bindingContext as FavoritesViewModel
  if (!vm) {
    vm = new FavoritesViewModel()
    page.bindingContext = vm
  } else {
    // Refresh in case favorites changed in the other tab.
    vm.reload()
  }
}

function viewModel(args: EventData): FavoritesViewModel {
  return (args.object as View).page.bindingContext as FavoritesViewModel
}

export function onHeroTap(args: EventData) {
  viewModel(args).onHeroTap(args)
}

export function removeFavorite(args: EventData) {
  viewModel(args).removeFavorite(args)
}
