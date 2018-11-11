import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss']
})
export class LogInPage implements OnInit {
  constructor(
    private platform: Platform,
    public authService: AuthService,
    public router: Router,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {}

  onGoogleSignIn() {
    if (this.platform.is('cordova')) {
      this.authService
        .onNativeGoogleLogin()
        .then(res => {
          this.router.navigate(['/home']);
        })
        .catch();
    } else {
      this.authService
        .onWebGoogleLogin()
        .then(res => {
          this.router.navigate(['/home']);
        })
        .catch();
    }
  }
}
