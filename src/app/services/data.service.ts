import { Answer } from './../models/answer.model';
import { Question } from './../models/question.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

@Injectable()
export class DataService {
  private _messageSource: BehaviorSubject<any> = new BehaviorSubject('');
  private _systemDesignSource: BehaviorSubject<any> = new BehaviorSubject('');
  private _questionDesignSource: BehaviorSubject<any> = new BehaviorSubject('');
  private _emptyQuestionDesignSource: BehaviorSubject<
    any
  > = new BehaviorSubject('');
  systemDesignQuestionsCollection: AngularFirestoreCollection<Question>;
  systemDesignAnswersCollection: AngularFirestoreCollection<Answer>;

  constructor(private readonly afs: AngularFirestore) {}

  getCurrentCategory() {
    return this._messageSource.asObservable();
  }

  setCurrentCategory(currentCategoryId: string) {
    this._messageSource.next(currentCategoryId);
  }

  getCurrentSystemDesign() {
    return this._systemDesignSource.asObservable();
  }

  setCurrentSystemDesign(systemDesignId: string) {
    this._systemDesignSource.next(systemDesignId);
  }

  getCurrentQuestionId() {
    return this._questionDesignSource.asObservable();
  }

  setCurrentQuestionId(currentQuestionId: string) {
    this._questionDesignSource.next(currentQuestionId);
  }

  getCurrentQuestion() {
    return this._emptyQuestionDesignSource.asObservable();
  }

  setCurrentQuestion(question: Question) {
    this._emptyQuestionDesignSource.next(question);
  }

  insertQuestion(question: Question) {
    this.systemDesignQuestionsCollection = this.afs.collection(
      'system-design-questions'
    );
    this.systemDesignQuestionsCollection.add(question);
  }

  insertAnswer(answer: Answer) {
    this.systemDesignAnswersCollection = this.afs.collection(
      'system-design-answers'
    );
    this.systemDesignAnswersCollection.add(answer);
  }

  deleteQuestion(uniqueId: string) {
    console.log(uniqueId);
    this.systemDesignQuestionsCollection = this.afs.collection(
      'system-design-questions'
    );
    this.systemDesignQuestionsCollection
      .doc(uniqueId)
      .delete()
      .then(() => {});
  }
}
