import {
  Conversations,
  ConversationsId
} from './../models/conversations.model';
import { InterviewId } from './../models/interview.model';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-view-interview',
  templateUrl: './view-interview.page.html',
  styleUrls: ['./view-interview.page.scss']
})
export class ViewInterviewPage implements OnInit, OnDestroy {
  _interviewObServable: Observable<InterviewId>;
  _interviewSubscription: Subscription;
  private conversationsCollection: AngularFirestoreCollection<Conversations>;
  _conversations: Observable<ConversationsId[]>;
  noConversations = true;
  interview: InterviewId;
  constructor(
    public dataService: DataService,
    public router: Router,
    private readonly afs: AngularFirestore
  ) {}

  ngOnInit() {
    this._interviewObServable = this.dataService.getInterviewId();
    this._interviewSubscription = this._interviewObServable.subscribe(
      interviewId => {
        this.interview = interviewId;
        if (interviewId.id) {
          this.conversationsCollection = this.afs.collection<Conversations>(
            'interview-conversations',
            ref => {
              return ref.where('interviewId', '==', interviewId.id);
            }
          );
          this._conversations = this.conversationsCollection
            .snapshotChanges()
            .pipe(
              map(actions =>
                actions.map(a => {
                  this.noConversations = false;
                  const data = a.payload.doc.data() as Conversations;
                  const id = a.payload.doc.id;
                  return { id, ...data };
                })
              )
            );
        }
      }
    );
  }

  goBack() {
    this.router.navigate(['/interview-experiences-list']);
  }

  ngOnDestroy() {
    if (this._interviewSubscription) {
      this._interviewSubscription.unsubscribe();
    }
  }
}
