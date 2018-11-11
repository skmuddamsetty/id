import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class DataService {
  private _messageSource: BehaviorSubject<any> = new BehaviorSubject('');
  private _systemDesignSource: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(private readonly afs: AngularFirestore) {}

  getCurrentCategory() {
    return this._messageSource.asObservable();
  }

  setCurrentCategory(currentCategoryId: string) {
    this._messageSource.next(currentCategoryId);
  }

  getCurrentSystemDesign() {
    return this._systemDesignSource.asObservable();
  }

  setCurrentSystemDesign(systemDesignId: string) {
    this._systemDesignSource.next(systemDesignId);
  }
}
