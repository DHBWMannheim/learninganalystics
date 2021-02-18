import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuHelperService {
  private _reload = new Subject<void>();

  constructor() {}

  reloadMenu() {
    this._reload.next();
  }

  get onReload() {
    return this._reload.asObservable();
  }
}
