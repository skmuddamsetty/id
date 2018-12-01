import { ClientListPage } from './../client-list/client-list.page';
import { User } from './../models/user.model';
import { ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Category, CategoryId } from './../models/category.model';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Interview, InterviewId } from './../models/interview.model';
import { DataService } from './../services/data.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { TechnologiesListPage } from '../technologies-list/technologies-list.page';
import { RoleListPage } from '../role-list/role-list.page';

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
  user: User;
  _currentUserObjObServable: Observable<any>;
  _currentUserObjSubscription: Subscription;
  _selectedRoleObServable: Observable<any>;
  _selectedRoleSubscription: Subscription;
  selectedRole: any;
  _selectedClientObServable: Observable<any>;
  _selectedClientSubscription: Subscription;
  selectedClient: any;
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
      (displaySelectedTechs) => {
        this.displaySelectedTechs = displaySelectedTechs;
      }
    );
    this._selectedTechsKeysObServable = this.dataService.getSelectedTechKeys();
    this._selectedTechsKeysSubscription = this._selectedTechsKeysObServable.subscribe(
      (selectedTechs) => {
        this.selectedTechs = selectedTechs;
      }
    );
    this._currentUserObjObServable = this.authService.getCurrentUserObj();
    this._currentUserObjSubscription = this._currentUserObjObServable.subscribe(
      (user) => {
        this.user = user;
        this.currentuid = this.user.uid;
      }
    );
    this._selectedRoleObServable = this.dataService.getSelectedRole();
    this._selectedRoleSubscription = this._selectedRoleObServable.subscribe(
      (role) => {
        this.selectedRole = role;
      }
    );
    this._selectedClientObServable = this.dataService.getSelectedClient();
    this._selectedClientSubscription = this._selectedClientObServable.subscribe(
      (client) => {
        this.selectedClient = client;
      }
    );
  }

  onProceed() {
    console.log(this.myForm);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const interview: Interview = {
      title: this.myForm.value.title,
      company: this.selectedClient.key,
      companyDesc: this.selectedClient.value,
      createUserId: this.currentuid,
      technologies: this.selectedTechs,
      createDate: timestamp,
      location: this.myForm.value.location,
      role: this.selectedRole.key,
      roleDesc: this.selectedRole.value,
      createUserName: this.user.username
    };
    this.insertInterview(interview);
  }

  insertInterview(interview: Interview) {
    this.interviewsCollection = this.afs.collection('interviews');
    this.interviewsCollection.add(interview).then((res) => {
      const interviewId: InterviewId = {
        createUserId: this.currentuid,
        id: res.id,
        title: '',
        company: ''
      };
      this.updateInterviewsCount();
      this.dataService.setInterviewId(interviewId);
      this.newInterviewIdFromDb = interviewId.id;
    });
  }

  updateInterviewsCount() {
    let searchCategory = '';
    if (this.selectedRole) {
      console.log(this.selectedRole);
      if (this.selectedRole.value.toLowerCase().includes('java')) {
        searchCategory = 'javainterviews';
      } else {
        searchCategory = 'interviewexperience';
      }
      console.log(searchCategory);
      this.categoriesCollection = this.afs.collection<Category>(
        'categories',
        (ref) => {
          return ref.where('key', '==', searchCategory);
        }
      );
      this._categories = this.categoriesCollection.snapshotChanges().pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Category;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
      this.categoriesSubscription = this._categories.subscribe((res) => {
        res.map((category) => {
          this.interviewsCount = category.count;
          this.categoryId = category.id;
          if (this.categoryId) {
            this.afs.doc<Category>('categories/' + this.categoryId).update({
              count: this.interviewsCount + 1
            });
            this.categoriesSubscription.unsubscribe();
          }
        });
      });
    }
  }

  private initForm() {
    const title = null;
    const company = null;
    this.myForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      location: new FormControl(null, Validators.required)
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
    if (this._currentUserObjSubscription) {
      this._currentUserObjSubscription.unsubscribe();
    }
    if (this._selectedRoleSubscription) {
      this._selectedRoleSubscription.unsubscribe();
    }
    if (this._selectedClientSubscription) {
      this._selectedClientSubscription.unsubscribe();
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

  onOpenClientsModal() {
    this.openClientModal();
  }

  async openClientModal() {
    const modal = await this.modalCtrl.create({
      component: ClientListPage
    });

    return await modal.present();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: TechnologiesListPage
    });

    return await modal.present();
  }

  onSelectClient(e: Event) {
    e.preventDefault();
  }

  onOpenRolesModal() {
    this.openRolesModal();
  }

  async openRolesModal() {
    const modal = await this.modalCtrl.create({
      component: RoleListPage
    });

    return await modal.present();
  }
}
