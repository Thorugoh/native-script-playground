import { fadeLengthProperty, LabelMarqueeCommon } from './common';

export class LabelMarquee extends LabelMarqueeCommon {

    // @ts-ignore
    get ios(): MarqueeLabel{
        return this.nativeView;
    }

    createNativeView(): Object {
        return MarqueeLabel.alloc().init();
    }

    initNativeView(): void {
        const nativeView = <MarqueeLabel>this.nativeView;
        nativeView.fadeLength = 10;
        nativeView.scrollDuration = 8;
    }

    [fadeLengthProperty.setNative](value: number) {
        this.ios.fadeLength = value;
    }
}
