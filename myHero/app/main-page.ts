import { EventData, isIOS, ItemEventData, NavigatedData, Page, View } from '@nativescript/core'
import { HelloWorldModel } from './main-view-model'

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  if (!args.isBackNavigation) {
    page.bindingContext = new HelloWorldModel()
  }
}

function viewModel(args: EventData): HelloWorldModel {
  return (args.object as View).page.bindingContext as HelloWorldModel
}

export function onSearch(args: EventData) {
  viewModel(args).onSearch(args)
}

export function onHeroTap(args: ItemEventData) {
  viewModel(args).onHeroTap(args)
}

// Remove the default white cell selection highlight on iOS.
export function onItemLoading(args: ItemEventData) {
  if (isIOS && args.ios) {
    args.ios.selectionStyle = UITableViewCellSelectionStyle.None
  }
}

export function toggleFavorite(args: EventData) {
  viewModel(args).toggleFavorite(args)
}
