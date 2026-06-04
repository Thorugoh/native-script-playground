import { Observable, Frame } from "@nativescript/core";
import { taskStore } from "../shared/task-store";
import { ItemViewModel, Category, Priority } from "../home/item-view-model";

const CATEGORIES: Category[] = ['Personal', 'Work', 'Grocery', 'Health', 'Education'];

export class AddTaskViewModel extends Observable {
    private _title = '';
    private _description = '';
    private _selectedCategory: Category | undefined;
    private _selectedPriority: Priority | undefined;
    private _selectedDate: Date | undefined;
    private _showDatePicker = false;
    private _titleError = '';

    readonly categories = CATEGORIES;

    get title() { return this._title; }
    set title(v: string) {
        this._title = v;
        this.notifyPropertyChange('title', v);
        if (v.trim()) {
            this.titleError = '';
        }
    }

    get titleError() { return this._titleError; }
    set titleError(v: string) {
        this._titleError = v;
        this.notifyPropertyChange('titleError', v);
        this.notifyPropertyChange('hasTitleError', this.hasTitleError);
    }

    get hasTitleError(): boolean { return this._titleError.length > 0; }

    get description() { return this._description; }
    set description(v: string) {
        this._description = v;
        this.notifyPropertyChange('description', v);
    }

    get selectedCategory() { return this._selectedCategory; }

    get selectedPriority() { return this._selectedPriority; }

    get selectedDate() { return this._selectedDate ?? new Date(); }
    set selectedDate(v: Date) {
        this._selectedDate = v;
        this.notifyPropertyChange('selectedDate', v);
        this.notifyPropertyChange('dueDateFormatted', this.dueDateFormatted);
    }

    get dueDateFormatted(): string {
        if (!this._selectedDate) return 'Set date';
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        if (this._selectedDate.toDateString() === today.toDateString()) return 'Today';
        if (this._selectedDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return this._selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    get showDatePicker() { return this._showDatePicker; }
    set showDatePicker(v: boolean) {
        this._showDatePicker = v;
        this.notifyPropertyChange('showDatePicker', v);
    }

    toggleDatePicker() {
        this.showDatePicker = !this._showDatePicker;
    }

    selectCategory(args: any) {
        const cat = args?.object?.text as Category;
        this._selectedCategory = cat;
        this.notifyPropertyChange('selectedCategory', cat);
        CATEGORIES.forEach(c => {
            this.notifyPropertyChange(`chipClass_${c}`, this._chipClass(c));
        });
    }

    chipClass(cat: Category): string {
        return this._chipClass(cat);
    }

    private _chipClass(cat: Category): string {
        return this._selectedCategory === cat ? 'chip chip-active' : 'chip';
    }

    setPriorityHigh()   { this._setPriority('high'); }
    setPriorityMedium() { this._setPriority('medium'); }
    setPriorityLow()    { this._setPriority('low'); }

    private _setPriority(p: Priority) {
        this._selectedPriority = p;
        this.notifyPropertyChange('selectedPriority', p);
        this.notifyPropertyChange('priorityHighClass',   this._priorityBtnClass('high'));
        this.notifyPropertyChange('priorityMediumClass', this._priorityBtnClass('medium'));
        this.notifyPropertyChange('priorityLowClass',    this._priorityBtnClass('low'));
    }

    get priorityHighClass()   { return this._priorityBtnClass('high'); }
    get priorityMediumClass() { return this._priorityBtnClass('medium'); }
    get priorityLowClass()    { return this._priorityBtnClass('low'); }

    private _priorityBtnClass(p: Priority): string {
        const active = this._selectedPriority === p ? ' priority-active' : '';
        return `priority-btn priority-${p}${active}`;
    }

    createTask() {
        if (!this._title.trim()) {
            this.titleError = 'Title is required';
            return;
        }
        taskStore.items.push(new ItemViewModel({
            id: crypto.randomUUID(),
            title: this._title.trim(),
            description: this._description,
            category: this._selectedCategory,
            priority: this._selectedPriority,
            dueDate: this._selectedDate,
        }));
        Frame.topmost().goBack();
    }

    goBack() {
        Frame.topmost().goBack();
    }
}
