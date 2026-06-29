import { Utils } from '@nativescript/core'

// Presents the native iOS share sheet (UIActivityViewController).
export function shareText(text: string): void {
  const controller = UIActivityViewController.alloc().initWithActivityItemsApplicationActivities(
    [text],
    [],
  )
  Utils.ios.getRootViewController().presentViewControllerAnimatedCompletion(controller, true, null)
}
