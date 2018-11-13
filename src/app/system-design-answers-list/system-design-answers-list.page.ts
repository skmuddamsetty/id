import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from './../services/data.service';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-design-answers-list',
  templateUrl: './system-design-answers-list.page.html',
  styleUrls: ['./system-design-answers-list.page.scss']
})
export class SystemDesignAnswersListPage implements OnInit {
  currentQuestionObservable: Observable<any>;
  currentQuestionObservableSub: Subscription;
  currentQuestionId = '';
  constructor(
    public dataService: DataService,
    public router: Router,
    private readonly afs: AngularFirestore,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.currentQuestionObservable = this.dataService.getCurrentQuestionId();
    this.currentQuestionObservableSub = this.currentQuestionObservable.subscribe(
      selectedQuestionId => {
        this.currentQuestionId = selectedQuestionId;
      }
    );
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
