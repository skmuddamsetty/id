import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Interview, InterviewId } from './../models/interview.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-interview-experiences-list',
  templateUrl: './interview-experiences-list.page.html',
  styleUrls: ['./interview-experiences-list.page.scss']
})
export class InterviewExperiencesListPage implements OnInit {
  private interviewsCollection: AngularFirestoreCollection<Interview>;
  _interviews: Observable<InterviewId[]>;
  constructor(public router: Router, private readonly afs: AngularFirestore) {}

  ngOnInit() {
    this.interviewsCollection = this.afs.collection<Interview>('interviews');
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

  goBack() {
    this.router.navigate(['/home']);
  }
}