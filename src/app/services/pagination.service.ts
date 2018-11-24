import { QueryConfig } from './../models/query-config.model';
import { Interview } from './../models/interview.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { map, scan, take } from 'rxjs/operators';

@Injectable()
export class PaginationService {
  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  constructor(private afs: AngularFirestore) {}

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, opts?: any) {
    this.query = {
      path: path,
      field: field,
      limit: 2,
      ...opts
    };
    const first = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });

    this.mapAndUpdate(first);

    // Create the observable array for consumption in components
    this.data = this._data.asObservable().pipe(
      scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      })
    );
  }

  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor();
    console.log('cursor', cursor);
    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor);
    });
    this.mapAndUpdate(more);
  }

  // Determines the doc snapshot to paginate query
  private getCursor() {
    const current = this._data.value;
    console.log('current', current);
    if (current.length) {
      console.log('current.length', current.length);
      return this.query.prepend ? current[0] : current[current.length - 1];
    }
    return null;
  }

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    if (this._done.value || this._loading.value) {
      return;
    }

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col
      .snapshotChanges()
      .pipe(
        map(actions => {
          let values = actions.map(a => {
            const data = a.payload.doc.data() as Interview;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
          // If prepending, reverse the batch order
          values = this.query.prepend ? values.reverse() : values;
          console.log('values', values);

          // update source with new values, done loading
          this._data.next(values);
          this._loading.next(false);

          // no more values, mark done
          if (!values.length) {
            this._done.next(true);
          }
        })
      )
      .subscribe();
  }
}
