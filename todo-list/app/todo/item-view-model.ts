import { Observable } from "@nativescript/core";

export class ItemViewModel extends Observable {
    id: string;
    private _title: string;
    private _isChecked: boolean;

    constructor(data: { id: string; title: string }) {
        super();
        this.id = data.id;
        this._title = data.title;
        this._isChecked = false;
    }

    get title() {
        return this._title;
    }

    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
            this.notifyPropertyChange("title", value);
        }
    }

    get isChecked() {
        return this._isChecked;
    }

    set isChecked(value: boolean) {
        if (this._isChecked !== value) {
            this._isChecked = value;
            this.notifyPropertyChange("isChecked", value);
        }
    }

    toggleCheck() {
        this.isChecked = !this.isChecked;
    }
}
