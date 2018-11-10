import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.page.html',
  styleUrls: ['./log-out.page.scss']
})
export class LogOutPage implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    public router: Router,
    private googlePlus: GooglePlus,
    private platform: Platform
  ) {
    this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.googlePlus.logout();
    }
    this.router.navigate(['/log-in']);
  }

  ngOnInit() {}
}
