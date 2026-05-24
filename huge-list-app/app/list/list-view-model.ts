import { Observable, ObservableArray } from "@nativescript/core";
import { BenchmarkItem } from "~/models/benchmark.model";

export class ListViewModel extends Observable {
    public items: Array<BenchmarkItem> = [];
    constructor() {
        super()
        this.populateItems();
    }

    populateItems() {
        for (let i = 0; i < 1000; i++) {
            this.items.push({
                id: i,
                name: `Developer #${i}`,
                email: `dev.user.${i}@company.com`,
                avatar: 'res://icon',
                timestamp: new Date().toISOString()
            })
        }
    }

    onItemTap = (args: any) => {
        const index = args.index;
        // const clickedItem = this.items.getItem(index);
        // console.log(`Tapped item: ${clickedItem.name}`);
    }

    onHeavyWork = () => {
        console.log('Running heavy work on UI thread....');
        const start = Date.now();
        while (Date.now() - start < 2000) {

        }

        console.log("Heavy work finished")
    }
}