import { Observable, Subscription } from 'rxjs';
import { Category, CategoryId } from './../models/category.model';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Interview, InterviewId } from './../models/interview.model';
import { DataService } from './../services/data.service';
import {
  Validators,
  FormGroup,
  FormControl,
  FormArray,
  NgForm
} from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.page.html',
  styleUrls: ['./create-interview.page.scss']
})
export class CreateInterviewPage implements OnInit, OnDestroy {
  myForm: FormGroup;
  currentuid = '';
  interviewsCollection: AngularFirestoreCollection<Interview>;
  technologiesForm: FormGroup;
  private categoriesCollection: AngularFirestoreCollection<Category>;
  _categories: Observable<CategoryId[]>;
  categoriesSubscription: Subscription;
  interviewsCount = 0;
  categoryId = '';
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private readonly afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.authService.getCurrentUser() != null) {
      this.currentuid = this.authService.getCurrentUser().uid;
    }
    this.categoriesCollection = this.afs.collection<Category>(
      'categories',
      ref => {
        return ref.where('key', '==', 'interviewexperience');
      }
    );
    this._categories = this.categoriesCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Category;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    this.categoriesSubscription = this._categories.subscribe(res => {
      res.map(category => {
        this.interviewsCount = category.count;
        this.categoryId = category.id;
      });
    });
    this.interviewsCollection = this.afs.collection('interviews');
  }

  onProceed() {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const interview: Interview = {
      title: this.myForm.value.title,
      company: this.myForm.value.company,
      createUserId: this.currentuid,
      technologies: this.myForm.value.technologies,
      createDate: timestamp,
      location: this.myForm.value.location,
      role: this.myForm.value.role
    };
    this.insertInterview(interview);
  }

  insertInterview(interview: Interview) {
    this.interviewsCollection = this.afs.collection('interviews');
    this.interviewsCollection.add(interview).then(res => {
      const interviewId: InterviewId = {
        createUserId: this.currentuid,
        id: res.id,
        title: '',
        company: ''
      };
      this.interviewsCount = this.interviewsCount + 1;
      this.dataService.updateInterviewCount(
        this.categoryId,
        this.interviewsCount
      );
      this.dataService.setInterviewId(interviewId);
      this.router.navigate(['/post-interview-experience']);
    });
  }

  private initForm() {
    const title = null;
    const company = null;
    const technologies = [];
    this.myForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      company: new FormControl(company, Validators.required),
      technologies: new FormArray(technologies, Validators.required),
      location: new FormControl(null, Validators.required),
      role: new FormControl(null, Validators.required)
    });
  }

  onAddTechnology(ngForm: NgForm) {
    (<FormArray>this.myForm.get('technologies')).push(
      new FormControl(ngForm.value.technology, Validators.required)
    );
    ngForm.resetForm();
  }

  onDeleteTechnology(index: number) {
    (<FormArray>this.myForm.get('technologies')).removeAt(index);
  }

  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
