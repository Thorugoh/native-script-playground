import { CoreTypes, View } from '@nativescript/core'

// Quick "pop" pulse: scale up then back, used when (un)favoriting.
export function pulse(view: View): Promise<void> {
  return view
    .animate({ scale: { x: 1.4, y: 1.4 }, duration: 120, curve: CoreTypes.AnimationCurve.easeOut })
    .then(() =>
      view.animate({ scale: { x: 1, y: 1 }, duration: 120, curve: CoreTypes.AnimationCurve.easeIn }),
    )
}
