import { QuestionId } from './../models/question.model';
import { AuthService } from './../services/auth.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { DataService } from './../services/data.service';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Answer, AnswerId } from '../models/answer.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-system-design-answers-list',
  templateUrl: './system-design-answers-list.page.html',
  styleUrls: ['./system-design-answers-list.page.scss']
})
export class SystemDesignAnswersListPage implements OnInit, OnDestroy {
  currentQuestionObservable: Observable<any>;
  currentQuestionObservableSub: Subscription;
  currentQuestionId = '';
  question: QuestionId;
  myForm: FormGroup;
  currentuid = '';
  private systemDesignAnswersCollection: AngularFirestoreCollection<Answer>;
  _systemDesignAnswers: Observable<AnswerId[]>;
  constructor(
    public dataService: DataService,
    public router: Router,
    private readonly afs: AngularFirestore,
    private modalCtrl: ModalController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.authService.getCurrentUser() != null) {
      this.currentuid = this.authService.getCurrentUser().uid;
    }
    this.currentQuestionObservable = this.dataService.getCurrentQuestion();
    this.currentQuestionObservableSub = this.currentQuestionObservable.subscribe(
      question => {
        console.log(question);
        this.question = question;
        this.getSystemDesignAnswersList();
      }
    );
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  onPostAnswer() {
    const answer: Answer = {
      answer: this.myForm.value.answer,
      key: this.question.key,
      createUserId: this.currentuid,
      questionId: this.question.id
    };
    this.dataService.insertAnswer(answer);
    this.myForm.reset();
  }

  private initForm() {
    const answer = null;
    this.myForm = new FormGroup({
      answer: new FormControl(answer, Validators.required)
    });
  }

  getSystemDesignAnswersList() {
    // this.systemDesignAnswersCollection = this.afs.collection<Answer>(
    //   'system-design-answers'
    // );
    this.systemDesignAnswersCollection = this.afs.collection<Answer>(
      'system-design-answers',
      ref => {
        return ref.where('questionId', '==', this.question.id);
      }
    );
    this._systemDesignAnswers = this.systemDesignAnswersCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Answer;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  ngOnDestroy() {
    if (this.currentQuestionObservableSub) {
      this.currentQuestionObservableSub.unsubscribe();
    }
  }
}
