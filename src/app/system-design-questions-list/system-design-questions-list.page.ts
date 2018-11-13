import { AuthService } from './../services/auth.service';
import { SystemDesignAnswersListPage } from './../system-design-answers-list/system-design-answers-list.page';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Question, QuestionId } from './../models/question.model';
import { DataService } from './../services/data.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-system-design-questions-list',
  templateUrl: './system-design-questions-list.page.html',
  styleUrls: ['./system-design-questions-list.page.scss']
})
export class SystemDesignQuestionsListPage implements OnInit, OnDestroy {
  systemDesignObservable: Observable<any>;
  systemDesignObservableSub: Subscription;
  selectedSystemDesignKey = '';
  private systemDesignQuestionsCollection: AngularFirestoreCollection<Question>;
  _systemDesignQuestions: Observable<QuestionId[]>;
  myForm: FormGroup;
  currentuid = '';
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
    this.systemDesignObservable = this.dataService.getCurrentSystemDesign();
    this.systemDesignObservableSub = this.systemDesignObservable.subscribe(
      selectedCategory => {
        this.selectedSystemDesignKey = selectedCategory;
        this.getSystemDesignQuestionsList();
      }
    );
  }

  onPostQuestion() {
    const question: Question = {
      question: this.myForm.value.question,
      key: this.selectedSystemDesignKey,
      createUserId: this.currentuid
    };
    this.dataService.insertQuestion(question);
    this.myForm.reset();
  }

  getSystemDesignQuestionsList() {
    this.systemDesignQuestionsCollection = this.afs.collection<Question>(
      'system-design-questions'
    );
    this._systemDesignQuestions = this.systemDesignQuestionsCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Question;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  onQuestionClick(questionId: QuestionId) {
    const currentQuestion: QuestionId = {
      question: questionId.question,
      key: questionId.key,
      id: questionId.id,
      createUserId: questionId.createUserId
    };
    this.dataService.setCurrentQuestion(currentQuestion);
    this.moveToFirst();
  }

  async moveToFirst() {
    const modal = await this.modalCtrl.create({
      component: SystemDesignAnswersListPage
    });

    return await modal.present();
  }

  ngOnDestroy() {
    if (this.systemDesignObservable) {
      this.systemDesignObservableSub.unsubscribe();
    }
  }

  private initForm() {
    const question = null;
    this.myForm = new FormGroup({
      question: new FormControl(question, Validators.required)
    });
  }

  goBack() {
    this.router.navigate(['/system-design-interviews-list']);
  }

  onDeleteQuestion(id: string) {
    this.dataService.deleteQuestion(id);
  }
}
