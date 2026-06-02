import { ObservableArray } from "@nativescript/core";
import { ItemViewModel } from "../home/item-view-model";

class TaskStore {
    readonly items = new ObservableArray<ItemViewModel>();

    constructor() {
        this.items.push(new ItemViewModel({
            id: crypto.randomUUID(),
            title: 'Buy groceries',
            category: 'Grocery',
            priority: 'medium',
            dueDate: new Date(),
        }));
        this.items.push(new ItemViewModel({
            id: crypto.randomUUID(),
            title: 'Finish project report',
            category: 'Work',
            priority: 'high',
            dueDate: new Date(),
        }));
        this.items.push(new ItemViewModel({
            id: crypto.randomUUID(),
            title: 'Morning workout',
            category: 'Health',
            priority: 'low',
            dueDate: new Date(),
        }));
        this.items.push(new ItemViewModel({
            id: crypto.randomUUID(),
            title: 'Read new book chapter',
            category: 'Personal',
            priority: 'low',
            dueDate: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })(),
        }));
        this.items.push(new ItemViewModel({
            id: crypto.randomUUID(),
            title: 'Study TypeScript generics',
            category: 'Education',
            priority: 'medium',
            dueDate: new Date(),
        }));
        this.items.push(new ItemViewModel({
            id: crypto.randomUUID(),
            title: 'Team standup meeting',
            category: 'Work',
            priority: 'high',
            dueDate: new Date(),
        }));
    }
}

export const taskStore = new TaskStore();
