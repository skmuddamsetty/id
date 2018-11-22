import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-answers',
  templateUrl: './view-answers.page.html',
  styleUrls: ['./view-answers.page.scss']
})
export class ViewAnswersPage implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
