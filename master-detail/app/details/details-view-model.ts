import { Observable } from "@nativescript/core";
import { FlickModel } from "~/models/flick.model";
import { FlickService } from "~/services/flick.service";

export class DetailsViewModel extends Observable {
    private _flick: FlickModel;

    constructor(private _context: { flickId: number }) {
        super()

        this._flick = FlickService.getInstance().getFlickById(this._context.flickId)
    }

    get flick(): FlickModel {
        return this._flick
    }
}