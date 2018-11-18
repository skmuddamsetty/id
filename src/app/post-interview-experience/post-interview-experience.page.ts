import { AuthService } from './../services/auth.service';
import {
  Conversations,
  ConversationsId
} from './../models/conversations.model';
import { Conversation } from './../models/conversation.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { DataService } from './../services/data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-post-interview-experience',
  templateUrl: './post-interview-experience.page.html',
  styleUrls: ['./post-interview-experience.page.scss']
})
export class PostInterviewExperiencePage implements OnInit, OnDestroy {
  private conversationsCollection: AngularFirestoreCollection<Conversations>;
  _conversations: Observable<ConversationsId[]>;
  myForm: FormGroup;
  conversations: Conversations;
  conversationsArray: Conversation[] = [];
  conversationsSubscription: Subscription;
  currentInterviewId = '';
  currentuid = '';
  createUserId = '';
  constructor(
    private readonly afs: AngularFirestore,
    public router: Router,
    public dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.authService.getCurrentUser() != null) {
      this.currentuid = this.authService.getCurrentUser().uid;
    }
    this.dataService.getInterviewId().subscribe(res => {
      this.currentInterviewId = res.id;
      this.createUserId = res.createUserId;
    });
    this.conversationsCollection = this.afs.collection<Conversations>(
      'interview-conversations',
      ref => {
        return ref.where('interviewId', '==', this.currentInterviewId);
      }
    );
    this._conversations = this.conversationsCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Conversations;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    this.conversationsSubscription = this._conversations.subscribe(res => {
      this.conversationsArray = [];
      res.map(conversation => {
        conversation.conversations.forEach(intent => {
          this.conversationsArray.push(intent);
        });
      });
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  private initForm() {
    const question = null;
    const answer = null;
    this.myForm = new FormGroup({
      question: new FormControl(question, Validators.required),
      answer: new FormControl(answer, Validators.required)
    });
  }

  onAdd() {
    const conversation = {
      question: this.myForm.value.question,
      answer: this.myForm.value.answer
    };
    this.conversationsArray.push(conversation);
    this.myForm.reset();
  }

  onSubmit() {
    const cons: Conversations = {
      conversations: this.conversationsArray,
      interviewId: this.currentInterviewId,
      updateDate: firebase.firestore.FieldValue.serverTimestamp()
    };
    this.dataService.insertConversation(cons);
    this.conversationsArray = [];
  }

  ngOnDestroy() {
    if (this.conversationsSubscription) {
      this.conversationsSubscription.unsubscribe();
    }
  }
}
