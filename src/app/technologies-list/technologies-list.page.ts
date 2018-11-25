import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from './../services/data.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-technologies-list',
  templateUrl: './technologies-list.page.html',
  styleUrls: ['./technologies-list.page.scss']
})
export class TechnologiesListPage implements OnInit {
  private skillsCollection: AngularFirestoreCollection<[]>;
  constructor(
    private modalCtrl: ModalController,
    public dataService: DataService,
    private readonly afs: AngularFirestore
  ) {}
  public initForm = [];
  selectableTechs = [];
  selectedTechs = [];
  techMap = new Map();
  ngOnInit() {
    this.skillsCollection = this.afs
      .collection('skills')
      .valueChanges()
      .subscribe((res: any) => {
        this.initForm = res[0].skills;
        this.selectableTechs = this.initForm.slice();
      });
  }

  closeModal() {
    this.dataService.setSelectedTechs(this.selectedTechs);
    this.modalCtrl.dismiss();
  }

  onAddTechnology(data: any) {
    if (!this.techMap.has(data)) {
      for (let i = 0; i < this.selectableTechs.length; i++) {
        if (this.selectableTechs[i] === data) {
          this.selectedTechs.push(data);
          this.techMap.set(data, data);
        }
      }
    }
  }

  onRadioButton(technology: any) {
    this.selectedTechs.push(technology);
  }
  onDeleteTechnology(data: any) {
    for (let i = 0; i < this.selectedTechs.length; i++) {
      if (this.selectedTechs[i] === data) {
        this.selectedTechs.splice(i, 1);
        this.techMap.delete(data);
      }
    }
  }

  onFilterTechnology(searchText: Event) {
    const text = searchText as any;
    if (text.detail.value) {
      this.selectableTechs = this.selectableTechs.filter(technology =>
        technology.toLowerCase().includes(text.detail.value.toLowerCase())
      );
    } else {
      this.selectableTechs = this.initForm;
    }
  }
}
