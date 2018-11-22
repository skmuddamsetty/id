import { InterviewQuestionId } from './../models/interview-question.model';
import { AuthService } from './../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import {
  InterviewAnswer,
  InterviewAnswerId
} from './../models/interview-answer.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
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
    private readonly afs: AngularFirestore
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
        console.log(
          'this.currentInterviewQuestionId',
          this.currentInterviewQuestionId
        );
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
                  console.log(data);
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
      questiondId: this.currentInterviewQuestionId.id,
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

  ngOnDestroy() {
    if (this._currentUidSubscription) {
      this._currentUidSubscription.unsubscribe();
    }
    if (this._currentInterviewQuestionSubscription) {
      this._currentInterviewQuestionSubscription.unsubscribe();
    }
  }
}
