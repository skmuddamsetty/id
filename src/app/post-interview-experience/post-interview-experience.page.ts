import { ViewAnswersPage } from './../view-answers/view-answers.page';
import {
  InterviewQuestion,
  InterviewQuestionId
} from './../models/interview-question.model';
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
import { InterviewId } from '../models/interview.model';
import {
  ActionSheetController,
  ToastController,
  AlertController,
  ModalController
} from '@ionic/angular';

@Component({
  selector: 'app-post-interview-experience',
  templateUrl: './post-interview-experience.page.html',
  styleUrls: ['./post-interview-experience.page.scss']
})
export class PostInterviewExperiencePage implements OnInit, OnDestroy {
  private interviewQuestionsCollection: AngularFirestoreCollection<
    InterviewQuestion
  >;
  _interviewQuestions: Observable<InterviewQuestionId[]>;
  myForm: FormGroup;
  conversations: Conversations;
  conversationsArray: Conversation[] = [];
  conversationsSubscription: Subscription;
  currentInterviewId = '';
  currentuid = '';
  createUserId = '';
  _currentUidObServable: Observable<string>;
  _currentUidSubscription: Subscription;
  _currentInterviewIdObServable: Observable<InterviewId>;
  _currentInterviewIdSubscription: Subscription;
  constructor(
    private readonly afs: AngularFirestore,
    public router: Router,
    public dataService: DataService,
    private authService: AuthService,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public alertController: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.initForm();
    this._currentUidObServable = this.authService.getCurrentUid();
    this._currentUidSubscription = this._currentUidObServable.subscribe(
      currentUid => {
        this.currentuid = currentUid;
      }
    );
    this._currentInterviewIdObServable = this.dataService.getInterviewId();
    this._currentInterviewIdSubscription = this._currentInterviewIdObServable.subscribe(
      res => {
        this.currentInterviewId = res.id;
      }
    );
    this.currentInterviewId = 'q4EXvwy2Qogh6JOWglia';
    this.interviewQuestionsCollection = this.afs.collection<InterviewQuestion>(
      'interview-questions',
      ref => {
        return ref.where('interviewId', '==', this.currentInterviewId);
      }
    );
    this._interviewQuestions = this.interviewQuestionsCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as InterviewQuestion;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  onMoreOptions(interviewQuestionId: InterviewQuestionId) {
    this.presentActionSheet(interviewQuestionId);
  }

  async presentActionSheet(interviewQuestionId: InterviewQuestionId) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            console.log('Edit clicked');
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.presentDeleteAlertConfirm(interviewQuestionId);
          }
        },
        {
          text: 'Share',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Bookmark',
          icon: 'bookmark',
          handler: () => {
            console.log('Bookmark clicked');
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentDeleteAlertConfirm(interviewQuestionId: InterviewQuestionId) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message:
        'Are you sure you want to delete this <strong>Question</strong>?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.dataService.deleteInterviewQuestion(interviewQuestionId.id);
            this.presentToast('Your Question has been deleted Successfully!');
          }
        }
      ]
    });

    await alert.present();
  }

  private initForm() {
    const question = null;
    this.myForm = new FormGroup({
      question: new FormControl(question, Validators.required)
    });
  }

  ngOnDestroy() {
    if (this._currentUidSubscription) {
      this._currentUidSubscription.unsubscribe();
    }
    if (this._currentInterviewIdSubscription) {
      this._currentInterviewIdSubscription.unsubscribe();
    }
  }

  onPostQuestion() {
    const interviewQuestion: InterviewQuestion = {
      question: this.myForm.value.question,
      createDate: firebase.firestore.FieldValue.serverTimestamp(),
      createUserId: this.currentuid,
      interviewId: this.currentInterviewId
    };
    this.dataService.insertInterviewQuestion(interviewQuestion);
    this.presentToast('Your Question has been added Successfully!');
    this.myForm.reset();
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
}
