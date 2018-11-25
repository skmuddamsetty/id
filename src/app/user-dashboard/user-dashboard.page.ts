import { FilterInterviews } from './../models/filter-interviews.model';
import { DataService } from './../services/data.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss']
})
export class UserDashboardPage implements OnInit {
  currentuid = '';
  constructor(
    public dataService: DataService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    if (this.authService.getCurrentUser() != null) {
      this.currentuid = this.authService.getCurrentUser().uid;
    }
  }

  onViewYourInterviews() {
    const interviewFilters: FilterInterviews = {
      delete: true,
      edit: true,
      createUserId: this.currentuid,
      interviewId: '',
      technology: ''
    };
    this.dataService.setFilterInterviews(interviewFilters);
    this.router.navigate(['/interview-experiences-list']);
  }

  onViewYourProfile() {
    this.router.navigate(['/profile']);
  }
}
