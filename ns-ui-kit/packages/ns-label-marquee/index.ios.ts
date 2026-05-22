import { fadeLengthProperty, LabelMarqueeCommon } from './common';

export class LabelMarquee extends LabelMarqueeCommon {
    createNativeView(): Object {
        return MarqueeLabel.alloc().init();
    }

    initNativeView(): void {
        const nativeView = <MarqueeLabel>this.nativeView;
        nativeView.fadeLength = 10;
        nativeView.scrollDuration = 8;
    }

    [fadeLengthProperty.setNative](value: number) {
        (<MarqueeLabel>this.nativeView).fadeLength = value;
    }
}
