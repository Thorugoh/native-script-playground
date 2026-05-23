import { EventData, Page, Observable, ObservableArray } from "@nativescript/core";
import { ListPageModel } from "./list-page-model";

interface BenchmarkItem {
    id: number;
    name: string;
    email: string;
    avatar: string;
    timestamp: string;
}


export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;

    page.bindingContext = new ListPageModel();
}