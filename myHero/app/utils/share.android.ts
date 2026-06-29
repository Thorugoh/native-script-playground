import { Application } from '@nativescript/core'

// Opens the native Android share chooser (Intent.ACTION_SEND).
export function shareText(text: string): void {
  const intent = new android.content.Intent(android.content.Intent.ACTION_SEND)
  intent.setType('text/plain')
  intent.putExtra(android.content.Intent.EXTRA_TEXT, text)

  const chooser = android.content.Intent.createChooser(intent, 'Share via')
  Application.android.foregroundActivity.startActivity(chooser)
}
