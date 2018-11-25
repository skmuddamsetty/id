import { ModalController } from '@ionic/angular';
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
import { TechnologiesListPage } from '../technologies-list/technologies-list.page';

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
  newInterviewIdFromDb = '';
  _selectedTechsObServable: Observable<any[]>;
  _selectedTechsSubscription: Subscription;
  _selectedTechsKeysObServable: Observable<any[]>;
  _selectedTechsKeysSubscription: Subscription;
  selectedTechs = [];
  displaySelectedTechs = [];
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private readonly afs: AngularFirestore,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.initForm();
    this.selectedTechs = [];
    this.displaySelectedTechs = [];
    this._selectedTechsObServable = this.dataService.getSelectedTechs();
    this._selectedTechsSubscription = this._selectedTechsObServable.subscribe(
      displaySelectedTechs => {
        this.displaySelectedTechs = displaySelectedTechs;
      }
    );
    this._selectedTechsKeysObServable = this.dataService.getSelectedTechKeys();
    this._selectedTechsKeysSubscription = this._selectedTechsKeysObServable.subscribe(
      selectedTechs => {
        this.selectedTechs = selectedTechs;
      }
    );
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
    console.log(this.myForm);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const interview: Interview = {
      title: this.myForm.value.title,
      company: this.myForm.value.company,
      createUserId: this.currentuid,
      technologies: this.selectedTechs,
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
      this.newInterviewIdFromDb = interviewId.id;
    });
  }

  private initForm() {
    const title = null;
    const company = null;
    this.myForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      company: new FormControl(company, Validators.required),
      location: new FormControl(null, Validators.required),
      role: new FormControl(null, Validators.required)
    });
  }

  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
    if (this._selectedTechsSubscription) {
      this._selectedTechsSubscription.unsubscribe();
    }
    if (this._selectedTechsKeysSubscription) {
      this._selectedTechsKeysSubscription.unsubscribe();
    }
    this.myForm.reset();
    this.selectedTechs = [];
    this.displaySelectedTechs = [];
  }

  onClickPostExperience() {
    this.router.navigate(['/post-interview-experience']);
  }

  onOpenTechnologiesModal() {
    this.openModal();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: TechnologiesListPage
    });

    return await modal.present();
  }
}
