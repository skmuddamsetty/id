import { AuthService } from './../services/auth.service';
import { FilterInterviews } from './../models/filter-interviews.model';
import { Observable, Subscription } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Interview, InterviewId } from './../models/interview.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import {
  AlertController,
  ToastController,
  ActionSheetController
} from '@ionic/angular';

@Component({
  selector: 'app-interview-experiences-list',
  templateUrl: './interview-experiences-list.page.html',
  styleUrls: ['./interview-experiences-list.page.scss']
})
export class InterviewExperiencesListPage implements OnInit, OnDestroy {
  private interviewsCollection: AngularFirestoreCollection<Interview>;
  _interviews: Observable<InterviewId[]>;
  _interviewFiltersObServable: Observable<FilterInterviews>;
  _interviewFiltersSubscription: Subscription;
  currentInterviewKey = '';
  interviewFiltersObj: FilterInterviews;
  noInterviews = true;
  _currentUidObServable: Observable<string>;
  _currentUidSubscription: Subscription;
  currentuid = '';
  lastVisible: any;
  interviews: Interview[];
  interviewsList: Interview[];
  _initInterviewsSubscription: Subscription;
  _scrollInterviewsSubscription: Subscription;
  filter = '';
  constructor(
    public router: Router,
    private readonly afs: AngularFirestore,
    public dataService: DataService,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this._interviews = this.dataService.getInterviews();
    this._currentUidObServable = this.authService.getCurrentUid();
    this._currentUidSubscription = this._currentUidObServable.subscribe(
      currentUid => {
        this.currentuid = currentUid;
      }
    );
    this._interviewFiltersObServable = this.dataService.getFilterInterviews();
    this._interviewFiltersSubscription = this._interviewFiltersObServable.subscribe(
      interviewFilters => {
        this.interviewFiltersObj = interviewFilters;
        if (this.interviewFiltersObj && this.interviewFiltersObj.createUserId) {
          this.filter = 'createUserId';
          this.interviewsCollection = this.afs.collection<Interview>(
            'interviews',
            ref => {
              return ref
                .where(
                  'createUserId',
                  '==',
                  this.interviewFiltersObj.createUserId
                )
                .limit(2);
            }
          );
        } else if (
          this.interviewFiltersObj &&
          this.interviewFiltersObj.technology
        ) {
          this.interviewsCollection = this.afs.collection<Interview>(
            'interviews',
            ref => {
              return ref.where(
                'technologies',
                'array-contains',
                this.interviewFiltersObj.technology
              );
            }
          );
        } else {
          this.filter = '';
          this.interviewsCollection = this.afs.collection<Interview>(
            'interviews',
            ref => {
              return ref.orderBy('createDate', 'desc').limit(2);
            }
          );
        }
        this.interviewsCollection
          .get()
          .toPromise()
          .then(documentSnapshots => {
            // Get the last visible document
            this.lastVisible =
              documentSnapshots.docs[documentSnapshots.docs.length - 1];
            console.log(this.lastVisible);
          })
          .catch(err => {
            this.lastVisible = '';
          });
        this._initInterviewsSubscription = this.interviewsCollection
          .snapshotChanges()
          .pipe(
            map(actions => {
              this.interviews = actions.map(a => {
                this.noInterviews = false;
                const data = a.payload.doc.data() as Interview;
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            })
          )
          .subscribe(res => {
            console.log(this.interviews);
            this.dataService.setInterviews(this.interviews);
          });
      }
    );
  }

  onViewInterview(interview: InterviewId) {
    this.dataService.setInterviewId(interview);
    this.router.navigate(['/view-interview']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    if (this._interviewFiltersSubscription) {
      this._interviewFiltersSubscription.unsubscribe();
    }
    if (this._initInterviewsSubscription) {
      this._initInterviewsSubscription.unsubscribe();
    }
    if (this._scrollInterviewsSubscription) {
      this._scrollInterviewsSubscription.unsubscribe();
    }
  }

  onMoreOptions(interviewId: InterviewId) {
    this.presentActionSheet(interviewId);
  }

  async presentActionSheet(interviewId: InterviewId) {
    if (interviewId.createUserId === this.currentuid) {
      const actionSheet = await this.actionSheetController.create({
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
              this.presentDeleteAlertConfirm(interviewId);
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
    } else {
      const actionSheet = await this.actionSheetController.create({
        buttons: [
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
  }

  async presentDeleteAlertConfirm(interviewId: InterviewId) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message:
        'Are you sure you want to delete this <strong>Interview</strong>?',
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
            this.afs
              .collection('interviews')
              .doc(interviewId.id)
              .delete()
              .then(res => {
                this.presentToast(
                  'Your Interview has been deleted Successfully!'
                );
              })
              .catch(err => {
                this.presentToast(
                  'Sorry, We have encountered an issue while removing your post, Please try it after some time.'
                );
              });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  doInfinite(infiniteScroll) {
    if (this._initInterviewsSubscription) {
      this._initInterviewsSubscription.unsubscribe();
    }
    if (this.lastVisible) {
      console.log('Begin async operation');
      if (this.filter === 'createUserId') {
        this.interviewsCollection = this.afs.collection<Interview>(
          'interviews',
          ref => {
            return ref
              .where(
                'createUserId',
                '==',
                this.interviewFiltersObj.createUserId
              )
              .limit(1)
              .startAfter(this.lastVisible);
          }
        );
      } else {
        this.interviewsCollection = this.afs.collection<Interview>(
          'interviews',
          ref => {
            return ref
              .orderBy('createDate', 'desc')
              .limit(1)
              .startAfter(this.lastVisible);
          }
        );
      }
      this.interviewsCollection
        .get()
        .toPromise()
        .then(documentSnapshots => {
          // Get the last visible document
          this.lastVisible =
            documentSnapshots.docs[documentSnapshots.docs.length - 1];
          console.log(this.lastVisible);
        });
      this._scrollInterviewsSubscription = this.interviewsCollection
        .snapshotChanges()
        .pipe(
          map(actions => {
            actions.map(a => {
              this.noInterviews = false;
              const data = a.payload.doc.data() as Interview;
              const id = a.payload.doc.id;
              this.interviews.push(data);
              return { id, ...data };
            });
          })
        )
        .subscribe(res => {
          console.log('scroll', this.interviews);
          this.dataService.setInterviews(this.interviews);
          infiniteScroll.target.complete();
          this._scrollInterviewsSubscription.unsubscribe();
        });
    }
  }

  onPostInterviewExperience() {
    this.router.navigate(['/create-interview']);
  }
}
