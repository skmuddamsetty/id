import { DataService } from './../services/data.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-design-interviews-list',
  templateUrl: './system-design-interviews-list.page.html',
  styleUrls: ['./system-design-interviews-list.page.scss']
})
export class SystemDesignInterviewsListPage implements OnInit, OnDestroy {
  systemDesignObservable: Observable<any>;
  systemDesignObservableSub: Subscription;
  selectedSystemDesignKey = '';
  constructor(public dataService: DataService, public router: Router) {}

  ngOnInit() {
    this.systemDesignObservable = this.dataService.getCurrentSystemDesign();
    this.systemDesignObservableSub = this.systemDesignObservable.subscribe(
      selectedCategory => {
        console.log(selectedCategory);
        this.selectedSystemDesignKey = selectedCategory;
      }
    );
  }

  ngOnDestroy() {
    if (this.systemDesignObservable) {
      this.systemDesignObservableSub.unsubscribe();
    }
  }

  onClickTakeInterview() {}

  onClickAskQuestion() {
    this.router.navigate(['/system-design-questions-list']);
  }

  goBack() {
    this.router.navigate(['/system-designs-list']);
  }
}
