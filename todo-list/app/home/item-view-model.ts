import { Observable } from "@nativescript/core";

export type Category = 'Personal' | 'Work' | 'Grocery' | 'Health' | 'Education';
export type Priority = 'low' | 'medium' | 'high';

export interface ItemData {
    id: string;
    title: string;
    description?: string;
    category?: Category;
    priority?: Priority;
    dueDate?: Date;
    dueTime?: string;
}

export class ItemViewModel extends Observable {
    id: string;
    private _title: string;
    private _description: string;
    private _isChecked: boolean;
    private _category: Category | undefined;
    private _priority: Priority | undefined;
    private _dueDate: Date | undefined;
    private _dueTime: string | undefined;

    constructor(data: Partial<ItemData> & { id: string; title: string }) {
        super();
        this.id = data.id;
        this._title = data.title;
        this._description = data.description ?? '';
        this._isChecked = false;
        this._category = data.category;
        this._priority = data.priority;
        this._dueDate = data.dueDate;
        this._dueTime = data.dueTime;
    }

    get title() { return this._title; }
    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
            this.notifyPropertyChange('title', value);
        }
    }

    get description() { return this._description; }
    set description(value: string) {
        if (this._description !== value) {
            this._description = value;
            this.notifyPropertyChange('description', value);
        }
    }

    get isChecked() { return this._isChecked; }
    set isChecked(value: boolean) {
        if (this._isChecked !== value) {
            this._isChecked = value;
            this.notifyPropertyChange('isChecked', value);
            this.notifyPropertyChange('isCheckedClass', this.isCheckedClass);
        }
    }

    get category() { return this._category; }
    set category(value: Category | undefined) {
        this._category = value;
        this.notifyPropertyChange('category', value);
        this.notifyPropertyChange('categoryLabel', this.categoryLabel);
    }

    get priority() { return this._priority; }
    set priority(value: Priority | undefined) {
        this._priority = value;
        this.notifyPropertyChange('priority', value);
        this.notifyPropertyChange('priorityColor', this.priorityColor);
        this.notifyPropertyChange('priorityLabel', this.priorityLabel);
    }

    get dueDate() { return this._dueDate; }
    set dueDate(value: Date | undefined) {
        this._dueDate = value;
        this.notifyPropertyChange('dueDate', value);
        this.notifyPropertyChange('dueDateFormatted', this.dueDateFormatted);
    }

    get dueTime() { return this._dueTime; }
    set dueTime(value: string | undefined) {
        this._dueTime = value;
        this.notifyPropertyChange('dueTime', value);
    }

    get categoryLabel(): string {
        return this._category ?? '';
    }

    get priorityColor(): string {
        switch (this._priority) {
            case 'high':   return '#FF4949';
            case 'medium': return '#FF9800';
            case 'low':    return '#4CAF50';
            default:       return '#AFAFAF';
        }
    }

    get priorityLabel(): string {
        switch (this._priority) {
            case 'high':   return 'High';
            case 'medium': return 'Medium';
            case 'low':    return 'Low';
            default:       return '';
        }
    }

    get dueDateFormatted(): string {
        if (!this._dueDate) return '';
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const d = this._dueDate;
        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    get isCheckedClass(): string {
        return this._isChecked ? 'done' : '';
    }

    toggleCheck() {
        this.isChecked = !this.isChecked;
    }
}
