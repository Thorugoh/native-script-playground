import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedNsLabelMarquee } from '@demo/shared';
import { } from '@vhugo/ns-label-marquee';

export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedNsLabelMarquee {
	
}
