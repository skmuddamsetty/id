import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ModalController,
  AlertController,
  ToastController
} from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.page.html',
  styleUrls: ['./client-list.page.scss']
})
export class ClientListPage implements OnInit {
  public initForm = [];
  selectableClients = [];
  selectedClient: any;
  clientMap = new Map();
  clientsSubscription: Subscription;
  constructor(
    private modalCtrl: ModalController,
    public dataService: DataService,
    private readonly afs: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.clientsSubscription = this.afs
      .collection('clients')
      .valueChanges()
      .subscribe((res: any) => {
        this.initForm = res[0].clients;
        this.selectableClients = this.initForm.slice();
        this.selectableClients.forEach((role) => {
          this.clientMap.set(
            role.value.toLowerCase(),
            role.value.toLowerCase()
          );
        });
      });
  }

  onClientSelect(client: any) {
    this.selectedClient = client;
  }

  closeModal() {
    this.dataService.setSelectedClient(this.selectedClient);
    this.modalCtrl.dismiss();
  }

  onFilterClient(searchText: Event) {
    const text = searchText as any;
    if (text.detail.value) {
      this.selectableClients = this.selectableClients.filter((client) =>
        client.value.toLowerCase().includes(text.detail.value.toLowerCase())
      );
    } else {
      this.selectableClients = this.initForm;
    }
  }

  onAddnewClient() {
    this.presentAlertPrompt();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Add New Role!',
      inputs: [
        {
          name: 'newClient',
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
            if (data.newClient) {
              if (!this.clientMap.get(data.newClient.toLowerCase())) {
                this.selectableClients.push({
                  value: data.newClient,
                  key: data.newClient
                });
                this.afs
                  .doc<any>('clients/' + 'Ua0ZrMmj7DWIHHHmp6xh')
                  .update({
                    clients: this.selectableClients
                  })
                  .then(() => {
                    this.presentToast(
                      'New Client has been added Successfully!'
                    );
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
    if (this.clientsSubscription) {
      this.clientsSubscription.unsubscribe();
    }
  }
}
