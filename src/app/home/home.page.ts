import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CategoryId } from '../models/category.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  private categoryCollection: AngularFirestoreCollection<Category>;
  categories: Observable<CategoryId[]>;
  constructor(
    private readonly afs: AngularFirestore,
    private router: Router,
    public dataService: DataService
  ) {
    console.log('jpme');
    this.categoryCollection = afs.collection<Category>('categories');
    // .snapshotChanges() returns a DocumentChangeAction[], which contains
    // a lot of information about "what happened" with each change. If you want to
    // get the data and the id use the map operator.
    this.categories = this.categoryCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Category;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  onCategorySelect(id: string) {
    this.dataService.setCurrentCategory(id);
    this.router.navigate(['/system-designs-list']);
  }
}