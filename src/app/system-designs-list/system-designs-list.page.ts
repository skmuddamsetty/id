import { SystemDesign, SystemDesignId } from './../models/system-design.model';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-system-designs-list',
  templateUrl: './system-designs-list.page.html',
  styleUrls: ['./system-designs-list.page.scss']
})
export class SystemDesignsListPage implements OnInit, OnDestroy {
  categoryObservable: Observable<any>;
  categoryObservableSub: Subscription;
  private systemDesignCollection: AngularFirestoreCollection<SystemDesign>;
  systemDesigns: Observable<SystemDesignId[]>;
  constructor(
    private dataService: DataService,
    private readonly afs: AngularFirestore,
    public router: Router
  ) {}

  ngOnInit() {
    this.categoryObservable = this.dataService.getCurrentCategory();
    this.categoryObservableSub = this.categoryObservable.subscribe(
      selectedCategory => {
        this.getSystemDesignsList(selectedCategory);
      }
    );
  }

  ngOnDestroy() {
    if (this.categoryObservableSub) {
      this.categoryObservableSub.unsubscribe();
    }
  }

  getSystemDesignsList(selectedCategory: string) {
    this.systemDesignCollection = this.afs.collection<SystemDesign>(
      'system-designs'
    );
    this.systemDesigns = this.systemDesignCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as SystemDesign;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  onSystemDesignClick(systemDesignId: string) {
    this.dataService.setCurrentSystemDesign(systemDesignId);
    this.router.navigate(['/system-design-interviews-list']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
