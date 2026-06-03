import { Observable, ObservableArray, Frame } from "@nativescript/core";
import { taskStore } from "../shared/task-store";
import { ItemViewModel, Category } from "./item-view-model";

const CATEGORIES = ['All', 'Personal', 'Work', 'Grocery', 'Health', 'Education'];

export class HomeViewModel extends Observable {
    private _activeCategory = 'All';
    private _filteredItems: ObservableArray<ItemViewModel>;

    readonly userName = 'Hugo';
    readonly categories = CATEGORIES;

    constructor() {
        super();
        this._filteredItems = this._buildFiltered();
        taskStore.items.addEventListener(ObservableArray.changeEvent, () => {
            this._refreshFiltered();
        });
    }

    get todayDate(): string {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric'
        });
    }

    get activeCategory(): string {
        return this._activeCategory;
    }

    get filteredItems(): ObservableArray<ItemViewModel> {
        return this._filteredItems;
    }

    get isEmpty(): boolean {
        return this._filteredItems.length === 0;
    }

    setActiveCategory(args: any) {
        const cat = args?.object?.text ?? args;
        this._activeCategory = cat;
        this.notifyPropertyChange('activeCategory', cat);
        this._refreshFiltered();
        this.notifyPropertyChange('filteredItems', this._filteredItems);
    }

    onAddTask() {
        Frame.getFrameById('homeFrame')?.navigate({
            moduleName: 'add-task/add-task-page',
            transition: { name: 'slideTop', duration: 200 },
        });
    }

    deleteTask(args: any) {
        const item = args?.object?.bindingContext as ItemViewModel;
        if (!item) return;
        const idx = taskStore.items.indexOf(item);
        if (idx >= 0) taskStore.items.splice(idx, 1);
    }

    private _buildFiltered(): ObservableArray<ItemViewModel> {
        const arr = new ObservableArray<ItemViewModel>();
        const all = taskStore.items;
        for (let i = 0; i < all.length; i++) {
            const item = all.getItem(i);
            if (this._activeCategory === 'All' || item.category === this._activeCategory) {
                arr.push(item);
            }
        }
        return arr;
    }

    private _refreshFiltered() {
        this._filteredItems = this._buildFiltered();
        this.notifyPropertyChange('filteredItems', this._filteredItems);
        this.notifyPropertyChange('isEmpty', this.isEmpty);
    }
}
