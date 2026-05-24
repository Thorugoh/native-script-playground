import { Observable } from "@nativescript/core";

export class TodoViewModel extends Observable {
    public items = [{ title: "test" }]
    constructor() {
        super()
    }
}