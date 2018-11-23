import { InterviewQuestionId } from './../models/interview-question.model';
import { AuthService } from './../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import {
  InterviewAnswer,
  InterviewAnswerId
} from './../models/interview-answer.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  ModalController,
  ToastController,
  ActionSheetController,
  AlertController
} from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase/app';
import { DataService } from '../services/data.service';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-view-answers',
  templateUrl: './view-answers.page.html',
  styleUrls: ['./view-answers.page.scss']
})
export class ViewAnswersPage implements OnInit, OnDestroy {
  myForm: FormGroup;
  _currentUidObServable: Observable<string>;
  _currentUidSubscription: Subscription;
  _currentInterviewQuestionObServable: Observable<InterviewQuestionId>;
  _currentInterviewQuestionSubscription: Subscription;
  currentuid = '';
  currentInterviewQuestionId: InterviewQuestionId;
  private interviewAnswersCollection: AngularFirestoreCollection<
    InterviewAnswer
  >;
  _interviewAnswers: Observable<InterviewAnswerId[]>;
  noAnswers = true;
  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private dataService: DataService,
    public toastController: ToastController,
    private readonly afs: AngularFirestore,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.initForm();
    this._currentUidObServable = this.authService.getCurrentUid();
    this._currentUidSubscription = this._currentUidObServable.subscribe(
      currentUid => {
        this.currentuid = currentUid;
      }
    );
    this._currentInterviewQuestionObServable = this.dataService.getCurrentInterviewQuestion();
    this._currentInterviewQuestionSubscription = this._currentInterviewQuestionObServable.subscribe(
      currentInterviewQuestionId => {
        this.currentInterviewQuestionId = currentInterviewQuestionId;
        if (this.currentInterviewQuestionId) {
          console.log(
            'this.currentInterviewQuestionId',
            this.currentInterviewQuestionId
          );
          this.interviewAnswersCollection = this.afs.collection<
            InterviewAnswer
          >('interview-answers', ref => {
            return ref.where(
              'questionId',
              '==',
              this.currentInterviewQuestionId.id
            );
          });
          this._interviewAnswers = this.interviewAnswersCollection
            .snapshotChanges()
            .pipe(
              map(actions =>
                actions.map(a => {
                  this.noAnswers = false;
                  const data = a.payload.doc.data() as InterviewAnswer;
                  const id = a.payload.doc.id;
                  return { id, ...data };
                })
              )
            );
        }
      }
    );
  }

  private initForm() {
    this.myForm = new FormGroup({
      answer: new FormControl(null, Validators.required)
    });
  }

  onPostAnswer() {
    const interviewAnswer: InterviewAnswer = {
      answer: this.myForm.value.answer,
      createDate: firebase.firestore.FieldValue.serverTimestamp(),
      createUserId: this.currentuid,
      questionId: this.currentInterviewQuestionId.id,
      userName: 'John Doe'
    };
    // this.dataService.insertInterviewAnswer(interviewAnswer);
    this.afs
      .collection('interview-answers')
      .add(interviewAnswer)
      .then(result => {
        this.presentToast('Your Answer has been added Successfully!');
        this.myForm.reset();
      })
      .catch(err => {
        this.presentToast(
          'Sorry, We have encountered an issue while posting your answer. Please try after few moments!'
        );
      });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  onMoreOptions(interviewAnswerId: InterviewAnswerId) {
    this.presentActionSheet(interviewAnswerId);
  }

  async presentActionSheet(interviewAnswerId: InterviewAnswerId) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
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
            this.presentDeleteAlertConfirm(interviewAnswerId);
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

  async presentDeleteAlertConfirm(interviewQuestionId: InterviewQuestionId) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete this <strong>Answer</strong>?',
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
            this.presentToast('Your Answer has been deleted Successfully!');
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() {
    if (this._currentUidSubscription) {
      this._currentUidSubscription.unsubscribe();
    }
    if (this._currentInterviewQuestionSubscription) {
      this._currentInterviewQuestionSubscription.unsubscribe();
    }
  }
}
