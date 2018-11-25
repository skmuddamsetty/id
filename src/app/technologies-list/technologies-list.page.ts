import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-technologies-list',
  templateUrl: './technologies-list.page.html',
  styleUrls: ['./technologies-list.page.scss']
})
export class TechnologiesListPage implements OnInit {
  constructor(private modalCtrl: ModalController) {}
  public initForm = ['Test', 'One', 'Two'];
  selectableTechs = this.initForm.slice();
  selectedTechs = [];
  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  onAddTechnology(data: any) {
    for (let i = 0; i < this.selectableTechs.length; i++) {
      if (this.selectableTechs[i] === data) {
        this.selectableTechs.splice(i, 1);
        this.selectedTechs.push(data);
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
        this.selectableTechs.push(data);
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
