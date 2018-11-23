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
          this.interviewsCollection = this.afs.collection<Interview>(
            'interviews',
            ref => {
              return ref.where(
                'createUserId',
                '==',
                this.interviewFiltersObj.createUserId
              );
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
          this.interviewsCollection = this.afs.collection<Interview>(
            'interviews'
          );
        }
        this._interviews = this.interviewsCollection.snapshotChanges().pipe(
          map(actions =>
            actions.map(a => {
              this.noInterviews = false;
              const data = a.payload.doc.data() as Interview;
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );
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
}
