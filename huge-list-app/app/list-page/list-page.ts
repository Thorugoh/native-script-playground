import { EventData, Page, Observable, ObservableArray } from "@nativescript/core";

interface BenchmarkItem {
    id: number;
    name: string;
    email: string;
    avatar: string;
    timestamp: string;
}

let viewModel: Observable;

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;

    const largeData = new ObservableArray<BenchmarkItem>();
    for (let i = 0; i < 10000; i++) {
        largeData.push({
            id: i,
            name: `Developer #${i}`,
            email: `dev.user.${i}@company.com`,
            avatar: 'res://icon',
            timestamp: new Date().toISOString()
        })
    }

    viewModel = new Observable();
    viewModel.set('items', largeData);

    page.bindingContext = viewModel;
}

export function onItemTap(args: any) {
    const index = args.index;
    const items = viewModel.get('items') as ObservableArray<BenchmarkItem>;
    const clickedItem = items.getItem(index)
    console.log(`Tapped item: ${clickedItem.name}`);
}

export function onHeavyWork() {
    console.log('Running heavy work on UI thread....');
    const start = Date.now();
    while (Date.now() - start < 2000) {

    }

    console.log("Heavy work finished")
}