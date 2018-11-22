import { ViewAnswersPage } from './../view-answers/view-answers.page';
import { ModalController } from '@ionic/angular';
import {
  InterviewQuestion,
  InterviewQuestionId
} from './../models/interview-question.model';
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
  private questionsCollection: AngularFirestoreCollection<InterviewQuestion>;
  _interviewQuestions: Observable<InterviewQuestionId[]>;
  noConversations = true;
  interview: InterviewId;
  constructor(
    public dataService: DataService,
    public router: Router,
    private readonly afs: AngularFirestore,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this._interviewObServable = this.dataService.getInterviewId();
    this._interviewSubscription = this._interviewObServable.subscribe(
      interviewId => {
        this.interview = interviewId;
        if (interviewId.id) {
          this.questionsCollection = this.afs.collection<InterviewQuestion>(
            'interview-questions',
            ref => {
              return ref.where('interviewId', '==', interviewId.id);
            }
          );
          this._interviewQuestions = this.questionsCollection
            .snapshotChanges()
            .pipe(
              map(actions =>
                actions.map(a => {
                  this.noConversations = false;
                  const data = a.payload.doc.data() as InterviewQuestion;
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

  onViewAnswers(interviewQuestionId: InterviewQuestionId) {
    const interviewQuestion: InterviewQuestionId = {
      question: interviewQuestionId.question,
      id: interviewQuestionId.id,
      createUserId: interviewQuestionId.createUserId
    };
    this.dataService.setCurrentQuestion(interviewQuestion);
    this.moveToFirst();
  }

  async moveToFirst() {
    const modal = await this.modalCtrl.create({
      component: ViewAnswersPage
    });

    return await modal.present();
  }

  ngOnDestroy() {
    if (this._interviewSubscription) {
      this._interviewSubscription.unsubscribe();
    }
  }
}
