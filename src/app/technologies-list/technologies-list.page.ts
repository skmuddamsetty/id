import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { DataService } from './../services/data.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-technologies-list',
  templateUrl: './technologies-list.page.html',
  styleUrls: ['./technologies-list.page.scss']
})
export class TechnologiesListPage implements OnInit, OnDestroy {
  constructor(
    private modalCtrl: ModalController,
    public dataService: DataService,
    private readonly afs: AngularFirestore
  ) {}
  public initForm = [];
  selectableTechs = [];
  selectedTechsForDisplay = [];
  selectedTechsKeys = [];
  techMap = new Map();
  ngOnInit() {
    this.afs
      .collection('skills')
      .valueChanges()
      .subscribe((res: any) => {
        this.initForm = res[0].skills;
        this.selectableTechs = this.initForm.slice();
      });
  }

  closeModal() {
    this.dataService.setSelectedTechs(this.selectedTechsForDisplay);
    this.dataService.setSelectedTechKeys(this.selectedTechsKeys);
    this.modalCtrl.dismiss();
  }

  onAddTechnology(data: any, value: any) {
    if (!this.techMap.has(data)) {
      for (let i = 0; i < this.selectableTechs.length; i++) {
        if (this.selectableTechs[i].key === data) {
          this.selectedTechsForDisplay.push({ key: data, value: value });
          this.selectedTechsKeys.push(data);
          this.techMap.set(data, value);
        }
      }
    }
  }

  onDeleteTechnology(key: any) {
    for (let i = 0; i < this.selectedTechsForDisplay.length; i++) {
      if (this.selectedTechsForDisplay[i].key === key) {
        this.selectedTechsForDisplay.splice(i, 1);
        this.techMap.delete(key);
      }
    }
    for (let i = 0; i < this.selectedTechsKeys.length; i++) {
      if (this.selectedTechsKeys[i] === key) {
        this.selectedTechsKeys.splice(i, 1);
      }
    }
  }

  onFilterTechnology(searchText: Event) {
    const text = searchText as any;
    if (text.detail.value) {
      this.selectableTechs = this.selectableTechs.filter(technology =>
        technology.value.toLowerCase().includes(text.detail.value.toLowerCase())
      );
    } else {
      this.selectableTechs = this.initForm;
    }
  }

  ngOnDestroy() {}
}
