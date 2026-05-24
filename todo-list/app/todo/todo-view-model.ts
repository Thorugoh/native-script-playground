import { Observable } from "@nativescript/core";

interface Item {
    id: string;
    title: string;
}
export class TodoViewModel extends Observable {
    private _items = [{ title: "test", id: crypto.randomUUID() }]
    constructor() {
        super()
    }

    get items() {
        return this._items;
    }

    addTodo({ title }: Item) {
        this._items.push({ title, id: crypto.randomUUID() })
    }


}