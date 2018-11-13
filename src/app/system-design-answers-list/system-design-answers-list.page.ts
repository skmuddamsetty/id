import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from './../services/data.service';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-design-answers-list',
  templateUrl: './system-design-answers-list.page.html',
  styleUrls: ['./system-design-answers-list.page.scss']
})
export class SystemDesignAnswersListPage implements OnInit, OnDestroy {
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
    this.currentQuestionObservable = this.dataService.getCurrentQuestion();
    this.currentQuestionObservableSub = this.currentQuestionObservable.subscribe(
      question => {
        console.log(question);
        this.currentQuestionId = question.id;
      }
    );
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    if (this.currentQuestionObservableSub) {
      this.currentQuestionObservableSub.unsubscribe();
    }
  }
}
