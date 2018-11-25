import { Observable } from 'rxjs';
import { User } from './../models/user.model';
import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  currentuid = '';
  user: User;
  _currentUserObjObServable: Observable<any>;
  _currentUserObjSubscription: Subscription;
  constructor(
    public dataService: DataService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this._currentUserObjObServable = this.authService.getCurrentUserObj();
    this._currentUserObjSubscription = this._currentUserObjObServable.subscribe(
      user => {
        this.user = user;
      }
    );
  }

  onEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  onActivity() {
    console.log('Activity Clicked');
  }
}
