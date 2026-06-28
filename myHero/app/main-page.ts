import { NavigatedData, Page } from '@nativescript/core'
import { HelloWorldModel } from './main-view-model'

export function navigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  // Only build a fresh view model on forward navigation. On back navigation the
  // page keeps its existing bindingContext, preserving the search and favorites.
  if (!args.isBackNavigation) {
    page.bindingContext = new HelloWorldModel()
  }
}
