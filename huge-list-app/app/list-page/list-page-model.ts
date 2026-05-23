import { Observable, ObservableArray } from "@nativescript/core";
import { BenchmarkItem } from "~/models/benchmark.model";

export class ListPageModel extends Observable {
    private _items: BenchmarkItem[];

    constructor() {
        super()
        this.populateItems();
    }

    get items(): ObservableArray<BenchmarkItem> {
        return new ObservableArray(this._items)
    }

    populateItems() {
        const largeData = this.items;

        for (let i = 0; i < 10000; i++) {
            largeData.push({
                id: i,
                name: `Developer #${i}`,
                email: `dev.user.${i}@company.com`,
                avatar: 'res://icon',
                timestamp: new Date().toISOString()
            })
        }
    }

    onItemTap(args: any) {
        const index = args.index;
        const clickedItem = this._items[index];
        console.log(`Tapped item: ${clickedItem.name}`);
    }

    onHeavyWork() {
        console.log('Running heavy work on UI thread....');
        const start = Date.now();
        while (Date.now() - start < 2000) {

        }

        console.log("Heavy work finished")
    }
}