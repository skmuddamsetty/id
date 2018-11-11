import { DataService } from './../services/data.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-system-design-interviews-list',
  templateUrl: './system-design-interviews-list.page.html',
  styleUrls: ['./system-design-interviews-list.page.scss']
})
export class SystemDesignInterviewsListPage implements OnInit, OnDestroy {
  systemDesignObservable: Observable<any>;
  systemDesignObservableSub: Subscription;
  constructor(public dataService: DataService) {}

  ngOnInit() {
    this.systemDesignObservable = this.dataService.getCurrentSystemDesign();
    this.systemDesignObservableSub = this.systemDesignObservable.subscribe(
      selectedCategory => {
        console.log(selectedCategory);
      }
    );
  }

  ngOnDestroy() {
    if (this.systemDesignObservable) {
      this.systemDesignObservableSub.unsubscribe();
    }
  }
}
