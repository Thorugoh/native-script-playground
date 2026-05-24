import { EventData, Page } from "@nativescript/core";
import { TodoViewModel } from "./todo-view-model";

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new TodoViewModel();
}