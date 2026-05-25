import { Observable } from "@nativescript/core";

interface Item {
    id: string;
    title: string;
}
export class TodoViewModel extends Observable {
    private _newItem = "";
    private _items = [{ title: "test", id: crypto.randomUUID() }]
    constructor() {
        super()
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
        console.log({ item: this.newItem })
        this._items.push({ title: this.newItem, id: crypto.randomUUID() })
    }
}