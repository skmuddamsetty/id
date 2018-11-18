import { FilterInterviews } from './../models/filter-interviews.model';
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

  onCategorySelect(key: string) {
    const filterInterviews: FilterInterviews = {
      delete: false,
      edit: false,
      createUserId: '',
      interviewId: '',
      technology: ''
    };
    this.dataService.setCurrentCategory(key);
    if (
      key === 'interviewexperience' ||
      key === 'javainterviews' ||
      key === 'angularinterviews'
    ) {
      if (key === 'javainterviews') {
        filterInterviews.technology = 'java';
      } else if (key === 'angularinterviews') {
        filterInterviews.technology = 'angular';
      }
      this.dataService.setFilterInterviews(filterInterviews);
      this.router.navigate(['/interview-experiences-list']);
    } else if (key === 'postinterviewexperience') {
      this.router.navigate(['/create-interview']);
    } else {
      this.router.navigate(['/system-designs-list']);
    }
  }
}
