import { Observable, ObservableArray } from "@nativescript/core";
import { ItemViewModel } from "./item-view-model";

export class TodoViewModel extends Observable {
    private _newItem = "";
    private _items: ObservableArray<ItemViewModel>;

    constructor() {
        super()
        this._items = new ObservableArray()
        this._items.push(new ItemViewModel({ id: "123123", title: "teste" }))
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
        this._items.push(new ItemViewModel({ title: this.newItem, id: crypto.randomUUID() }))
    }
}