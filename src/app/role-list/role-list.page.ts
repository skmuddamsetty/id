import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ModalController,
  AlertController,
  ToastController
} from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.page.html',
  styleUrls: ['./role-list.page.scss']
})
export class RoleListPage implements OnInit, OnDestroy {
  public initForm = [];
  selectableRoles = [];
  selectedRole: any;
  selectedTechsKeys = [];
  roleMap = new Map();
  rolesSubscription: Subscription;
  constructor(
    private modalCtrl: ModalController,
    public dataService: DataService,
    private readonly afs: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.rolesSubscription = this.afs
      .collection('roles')
      .valueChanges()
      .subscribe((res: any) => {
        this.initForm = res[0].roles;
        this.selectableRoles = this.initForm.slice();
        this.selectableRoles.forEach((role) => {
          this.roleMap.set(role.value.toLowerCase(), role.value.toLowerCase());
        });
      });
  }

  onRoleSelect(role: any) {
    this.selectedRole = role;
  }

  closeModal() {
    this.dataService.setSelectedRole(this.selectedRole);
    this.modalCtrl.dismiss();
  }

  onFilterRole(searchText: Event) {
    const text = searchText as any;
    if (text.detail.value) {
      this.selectableRoles = this.selectableRoles.filter((role) =>
        role.value.toLowerCase().includes(text.detail.value.toLowerCase())
      );
    } else {
      this.selectableRoles = this.initForm;
    }
  }

  onAddNewRole() {
    this.presentAlertPrompt();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Add New Role!',
      inputs: [
        {
          name: 'newRole',
          type: 'text',
          placeholder: 'Enter Role'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Submit',
          handler: (data) => {
            if (data.newRole) {
              if (!this.roleMap.get(data.newRole.toLowerCase())) {
                this.selectableRoles.push({
                  value: data.newRole,
                  key: data.newRole
                });
                this.afs
                  .doc<any>('roles/' + 'to9MEf8HET4JIANC4Cgr')
                  .update({
                    roles: this.selectableRoles
                  })
                  .then(() => {
                    this.presentToast('New Role has been added Successfully!');
                  })
                  .catch((err) => {
                    this.presentToast('Sorry, Try again!');
                  });
              }
            }
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

  ngOnDestroy() {
    if (this.rolesSubscription) {
      this.rolesSubscription.unsubscribe();
    }
  }
}
