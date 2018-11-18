import { FilterInterviews } from './../models/filter-interviews.model';
import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
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
}
