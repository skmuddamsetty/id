import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss']
})
export class LogInPage implements OnInit {
  showSpinner = false;
  constructor(
    private platform: Platform,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {}

  onGoogleSignIn() {
    this.showSpinner = true;
    if (this.platform.is('cordova')) {
      this.authService
        .onNativeGoogleLogin()
        .then((res) => {
          this.showSpinner = false;
          // this.router.navigate(['/home']);
        })
        .catch();
    } else {
      this.authService
        .onWebGoogleLogin()
        .then((res) => {
          this.showSpinner = false;
          // this.router.navigate(['/home']);
        })
        .catch();
    }
  }
}
