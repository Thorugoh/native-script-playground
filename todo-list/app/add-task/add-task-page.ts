import { EventData, Page } from "@nativescript/core";
import { AddTaskViewModel } from "./add-task-view-model";

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new AddTaskViewModel();
}
