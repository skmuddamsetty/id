import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.page.html',
  styleUrls: ['./role-list.page.scss'],
})
export class RoleListPage implements OnInit, OnDestroy {
  public initForm = [];
  selectableRoles = [];
  selectedRole: any;
  selectedTechsKeys = [];
  techMap = new Map();
  rolesSubscription: Subscription;
  constructor(private modalCtrl: ModalController,
    public dataService: DataService,
    private readonly afs: AngularFirestore) { }

  ngOnInit() {
    this.rolesSubscription = this.afs
      .collection('roles')
      .valueChanges()
      .subscribe((res: any) => {
        this.initForm = res[0].roles;
        this.selectableRoles = this.initForm.slice();
      });
  }

  onRoleSelect(role: any){
    this.selectedRole = role;
  }

  closeModal() {
    this.dataService.setSelectedRole(this.selectedRole);
    this.modalCtrl.dismiss();
  }

  onFilterRole(searchText: Event) {
    const text = searchText as any;
    if (text.detail.value) {
      this.selectableRoles = this.selectableRoles.filter(role =>
        role.value.toLowerCase().includes(text.detail.value.toLowerCase())
      );
    } else {
      this.selectableRoles = this.initForm;
    }
  }

  ngOnDestroy(){
    if(this.rolesSubscription){
      this.rolesSubscription.unsubscribe();
    }
  }

}
