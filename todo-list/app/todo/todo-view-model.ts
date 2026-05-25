import { Observable, ObservableArray } from "@nativescript/core";

interface Item {
    id: string;
    title: string;
}
export class TodoViewModel extends Observable {
    private _newItem = "";
    private _items: ObservableArray<Item>;

    constructor() {
        super()
        this._items = new ObservableArray()
        this.items.push({
            id: "123123",
            title: "teste"
        })
    }

    get newItem(){
        return this._newItem
    }

    set newItem(text: string){
        this._newItem = text;
    }

    get items() {
        return this._items;
    }

    addTodo() {
        this.items.push({ title: this.newItem, id: crypto.randomUUID() })
    }
}