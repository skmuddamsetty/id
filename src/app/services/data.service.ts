import { FilterInterviews } from './../models/filter-interviews.model';
import { Category } from './../models/category.model';
import { Interview, InterviewId } from './../models/interview.model';
import { Conversations } from './../models/conversations.model';
import { Answer } from './../models/answer.model';
import { Question } from './../models/question.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable()
export class DataService {
  private _messageSource: BehaviorSubject<any> = new BehaviorSubject('');
  private _currentInterviewKey: BehaviorSubject<any> = new BehaviorSubject('');
  private _systemDesignSource: BehaviorSubject<any> = new BehaviorSubject('');
  private _questionDesignSource: BehaviorSubject<any> = new BehaviorSubject('');
  private _emptyQuestionDesignSource: BehaviorSubject<
    any
  > = new BehaviorSubject('');
  systemDesignQuestionsCollection: AngularFirestoreCollection<Question>;
  systemDesignAnswersCollection: AngularFirestoreCollection<Answer>;
  interviewExpConversationsCollection: AngularFirestoreCollection<
    Conversations
  >;
  interviewsCollection: AngularFirestoreCollection<Interview>;
  private _interviewId: BehaviorSubject<any> = new BehaviorSubject('');
  private categoryDoc: AngularFirestoreDocument<Category>;
  emptyFilterFoInterview: FilterInterviews = {
    delete: false,
    edit: false,
    createUserId: '',
    interviewId: '',
    technology: ''
  };
  private _filterInterviewsObservable: BehaviorSubject<
    FilterInterviews
  > = new BehaviorSubject(this.emptyFilterFoInterview);

  constructor(private readonly afs: AngularFirestore) {}

  getFilterInterviews() {
    return this._filterInterviewsObservable.asObservable();
  }

  setFilterInterviews(interviewsFilter: FilterInterviews) {
    this._filterInterviewsObservable.next(interviewsFilter);
  }

  getCurrentCategory() {
    return this._messageSource.asObservable();
  }

  setCurrentCategory(currentCategoryId: string) {
    this._messageSource.next(currentCategoryId);
  }

  getCurrentInterviewKey() {
    return this._currentInterviewKey.asObservable();
  }

  setCurrentInterviewKey(currentInterviewKey: string) {
    this._currentInterviewKey.next(currentInterviewKey);
  }

  getInterviewId() {
    return this._interviewId.asObservable();
  }

  setInterviewId(interview: InterviewId) {
    this._interviewId.next(interview);
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

  insertConversation(convesations: Conversations) {
    this.interviewExpConversationsCollection = this.afs.collection(
      'interview-conversations'
    );
    this.interviewExpConversationsCollection.add(convesations);
  }

  insertInterview(interview: Interview) {
    this.interviewsCollection = this.afs.collection('interviews');
    this.interviewsCollection.add(interview).then(res => console.log(res.id));
  }

  updateInterviewCount(id: string, count: number) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    this.categoryDoc = this.afs.doc<Category>('categories/' + id);
    this.categoryDoc.update({
      count: count,
      updateDate: timestamp
    });
  }
}
