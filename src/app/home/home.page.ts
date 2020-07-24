import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  loading: any;
  constructor(
    private router: Router,
    private platform: Platform,
    private google:GooglePlus,
    public loadingController: LoadingController,
    private fireAuth: AngularFireAuth
  ) {

  }

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      message: 'Connecting ...'
    });
  }


  async presentLoading(loading) {
    await loading.present();
  }


  async login() {
    let params;
    if (this.platform.is('android')) {
      params = {
        'webClientId': '239353981358-2ec6rnsr8uqitcjen2ri3k3r6d2r79vo.apps.googleusercontent.com',
        'offline': true
      }
    }
    else {
      params = {}
    }
    this.google.login(params)
      .then((response) => {
        const { idToken, accessToken } = response
        this.onLoginSuccess(idToken, accessToken);
      }).catch((error) => {
        console.log(error)
        alert('error:' + JSON.stringify(error))
      });
  }
  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
            .credential(accessToken);
    this.fireAuth.signInWithCredential(credential)
      .then((response) => {
        this.router.navigate(["/profile"]);
        this.loading.dismiss();
      })
  }
  onLoginError(err) {
    console.log(err);
  }
}