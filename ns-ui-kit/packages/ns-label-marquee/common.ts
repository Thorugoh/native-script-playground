import { booleanConverter, Label, Property } from '@nativescript/core';

export class LabelMarqueeCommon extends Label {

}

export const fadeLengthProperty = new Property<LabelMarqueeCommon, number>({
    name: 'fadeLength'
})

export const labelizeProperty = new Property<LabelMarqueeCommon, boolean>({
    name: 'labelize',
    defaultValue: false,
    valueConverter: booleanConverter
});

labelizeProperty.register(LabelMarqueeCommon)
fadeLengthProperty.register(LabelMarqueeCommon)