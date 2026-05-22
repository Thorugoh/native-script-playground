import { Label, Property } from '@nativescript/core';

export class LabelMarqueeCommon extends Label {

}

export const fadeLengthProperty = new Property<LabelMarqueeCommon, number>({
    name: 'fadeLength'
})

fadeLengthProperty.register(LabelMarqueeCommon)