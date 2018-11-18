import { FilterInterviews } from './../models/filter-interviews.model';
import { Observable, Subscription } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Interview, InterviewId } from './../models/interview.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-interview-experiences-list',
  templateUrl: './interview-experiences-list.page.html',
  styleUrls: ['./interview-experiences-list.page.scss']
})
export class InterviewExperiencesListPage implements OnInit, OnDestroy {
  private interviewsCollection: AngularFirestoreCollection<Interview>;
  _interviews: Observable<InterviewId[]>;
  _interviewFiltersObServable: Observable<FilterInterviews>;
  _interviewFiltersSubscription: Subscription;
  currentInterviewKey = '';
  interviewFiltersObj: FilterInterviews;
  constructor(
    public router: Router,
    private readonly afs: AngularFirestore,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this._interviewFiltersObServable = this.dataService.getFilterInterviews();
    this._interviewFiltersSubscription = this._interviewFiltersObServable.subscribe(
      interviewFilters => {
        this.interviewFiltersObj = interviewFilters;
      }
    );
    if (this.interviewFiltersObj && this.interviewFiltersObj.createUserId) {
      this.interviewsCollection = this.afs.collection<Interview>(
        'interviews',
        ref => {
          return ref.where(
            'createUserId',
            '==',
            this.interviewFiltersObj.createUserId
          );
        }
      );
    } else if (
      this.interviewFiltersObj &&
      this.interviewFiltersObj.technology
    ) {
      this.interviewsCollection = this.afs.collection<Interview>(
        'interviews',
        ref => {
          return ref.where(
            'technologies',
            'array-contains',
            this.interviewFiltersObj.technology
          );
        }
      );
    } else {
      this.interviewsCollection = this.afs.collection<Interview>('interviews');
    }
    this._interviews = this.interviewsCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Interview;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  onInterviewClick(interview: InterviewId) {
    this.dataService.setInterviewId(interview);
    this.router.navigate(['/post-interview-experience']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    if (this._interviewFiltersSubscription) {
      this._interviewFiltersSubscription.unsubscribe();
    }
  }
}
