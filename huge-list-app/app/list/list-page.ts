import { EventData, Page } from "@nativescript/core";
import { ListViewModel } from "./list-view-model";

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;

    page.bindingContext = new ListViewModel();
}
