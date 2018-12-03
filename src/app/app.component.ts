import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  isAuthenticated = false;
  loginIcon = 'log-in';
  showSplash = true;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Dashboard',
      url: '/user-dashboard',
      icon: 'list'
    },
    // {
    //   title: 'List',
    //   url: '/list',
    //   icon: 'list'
    // },
    {
      title: 'Sign out',
      url: '/log-out',
      icon: 'log-out'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    public router: Router,
    private googlePlus: GooglePlus,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      console.log('timestamp', timestamp);
      this.afAuth.auth.onAuthStateChanged((user) => {
        if (user) {
          this.showSplash = false;
          console.log('inside app component');
          this.isAuthenticated = true;
          this.authService.setCurrentUid(user.uid);
          this.authService.setCurrentUserObj(user);
          console.log(this.showSplash);
          this.router.navigate(['/home']); // change it as needed
        } else {
          this.showSplash = false;
          this.isAuthenticated = false;
          console.log('inside app component else');
          this.router.navigate(['/log-in']);
        }
      });
      console.log(this.showSplash);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.googlePlus.logout();
    }
    this.isAuthenticated = false;
    this.router.navigate(['/log-in']);
  }

  scrollHandler(e) {
    console.log(e);
  }
}
