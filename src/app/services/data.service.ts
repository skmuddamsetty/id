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
  systemDesignQuestionsCollection: AngularFirestoreCollection<Question>;

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

  insertQuestion(question: Question) {
    this.systemDesignQuestionsCollection = this.afs.collection(
      'system-design-questions'
    );
    this.systemDesignQuestionsCollection.add(question);
  }
}
