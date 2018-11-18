import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  isAuthenticated = false;
  loginIcon = 'log-in';
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person'
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
    private googlePlus: GooglePlus
  ) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    console.log('timestamp', timestamp);
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('inside app component');
        this.isAuthenticated = true;
        this.router.navigate(['/home']);
      } else {
        this.isAuthenticated = false;
        console.log('inside app component else');
        this.router.navigate(['/log-in']);
      }
    });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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
}
