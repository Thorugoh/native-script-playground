import { EventData, Frame, TabView } from '@nativescript/core'
import { HelloWorldModel } from './main-view-model'
import { FavoritesViewModel } from './favorites/favorites-view-model'

// navigatingTo doesn't fire on tab switches, so we refresh the now-active tab here.
export function onSelectedIndexChanged(args: EventData) {
  const tabView = args.object as TabView
  const frame = tabView.items[tabView.selectedIndex].view as Frame
  const vm = frame?.currentPage?.bindingContext

  if (vm instanceof FavoritesViewModel) {
    vm.reload()
  } else if (vm instanceof HelloWorldModel) {
    vm.refreshFavorites()
  }
}
