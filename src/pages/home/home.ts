import { Component, NgZone, ViewChild } from '@angular/core';
import { IamportCordova } from '@ionic-native/iamport-cordova';
import { DetailPage } from './../detail/detail'
import { IonicPage, ToastController, Slides, ModalController, ViewController, Events, Platform, App, AlertController, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

// import { Geolocation } from '@ionic-native/geolocation/';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { MypagePage } from './../../pages/mypage/mypage';
import { LoginpagePage } from './../../pages/loginpage/loginpage';
import { ChatPage } from '../chat/chat';
import { CoinsPage } from '../coins/coins';

import { SettingPage } from '../setting/setting';
import { FirstlandingPage } from '../firstlanding/firstlanding';
import { HomeslidePage } from '../homeslide/homeslide';

declare var naver: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Slides) slidess: Slides;
  sale_data: any;
  selectedbutton: any = 'vr'
  name: any;
  logined: any = "false"
  firemain = firebase.database().ref();
  slides = [];
  switcharray = [];
  dsarray = [];
  psarray = [];
  dsgamearray = [];
  switchgamearray = [];
  psgamearray = [];
  lat: any;
  lng: any;
  setting: any;
  id: any;
  version: any;
  realswitcharray: any;
  loginflag: any;
  userid: any;
  realpsarray: any;
  user: any;
  counter: any = 0;

  slide() {
    let modal = this.modal.create(HomeslidePage, {}, { cssClass: 'css-modal' });
    modal.present();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: '한번 더 뒤로가기를 누르면 앱이 종료됩니다.',
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  constructor(private toastCtrl: ToastController, public modal: ModalController, public view: ViewController, public platform: Platform, public app: App, public appVersion: AppVersion, public event: Events, public oneSignal: OneSignal, public zone: NgZone, public alertCtrl: AlertController, public navParam: NavParams, public navCtrl: NavController) {


    this.id = localStorage.getItem("id")
    this.name = localStorage.getItem("name")
    this.loginflag = localStorage.getItem("loginflag");
    console.log(this.loginflag);

    this.firemain.child("sale_data").once('value').then((snap) => {
      console.log(snap.val())
      this.sale_data = snap.val();
    })

    this.firemain.child('setting').once('value').then((snap) => {
      if (snap.val().login_freepass === true) {
        localStorage.setItem("loginflag", 'true');
        localStorage.setItem("id", snap.val().testid);
        this.id = snap.val().testid;
        this.loginflag = "true";
      }
      else if (this.loginflag == 'false' || this.loginflag == null) {
        let modal = this.modal.create(FirstlandingPage, {}, { cssClass: 'test-modal' });
        modal.onDidDismiss(data => {
          if (data != undefined) {
            console.log(data);

            // this.uploadImageToFirebase(data);
          }
        });
        modal.present();
      }
      platform.registerBackButtonAction(() => {

        let nav = this.app.getActiveNav();
        let activeView = nav.getActive();
        console.log("back presseddd");

        if (this.counter == 0) {
          this.counter++;
          this.presentToast();
          setTimeout(() => { this.counter = 0 }, 2000)
        } else {
          // console.log("exitapp");
          this.platform.exitApp();
        }
      });


      this.event.subscribe('star-rating:changed', (starRating) => { console.log(starRating) });

      console.log(this.id);
      console.log(this.loginflag);

      this.zone.run(() => {
        console.log("id is : " + this.id);
        if (this.id == null || this.id == undefined) {

        } else {
          this.firemain.child("users").child(this.id).once("value", (snapshot) => {
            console.log(snapshot.val());
            this.user = snapshot.val();
            console.log("user");
            console.log(this.user);
          })
        }

        this.firemain.child("setting").once("value", (snapshot) => {
          for (var a in snapshot.val()) {
            if (a == "expressmessage") {
              this.setting = snapshot.val()[a];
            }
            if (a == "version") {
              this.version = snapshot.val()[a];
            }
            console.log(snapshot.val()[a]);
          }

          var versionnumber = "";
          this.appVersion.getVersionNumber().then(version => {
            versionnumber = version;
            //0.2 3
            if (Number(this.version) > Number(versionnumber)) {
              this.confirmAlert2("앱을 업데이트 해주세요!")
            }
          });
        })
        this.firemain.child("category").once("value", (snapshot) => {

          for (var a in snapshot.val()) {
            console.log(a)
            if (a == "promotion") {
              for (var b in snapshot.val()[a]) {

                this.slides.push(snapshot.val()[a][b])
              }
            }
            if (a == "ps") {
              for (var b in snapshot.val()[a]) {
                console.log(b);
                console.log(snapshot.val()[a][b])
                if (b == "software") {
                  for (var c in snapshot.val()[a][b]) {
                    this.psgamearray.push(snapshot.val()[a][b][c]);
                  }
                }
                else if (b == "hardware") {
                  for (var c in snapshot.val()[a][b]) {
                    this.psarray.push(snapshot.val()[a][b][c]);
                  }
                }
              }
            }
            if (a == "switch") {
              for (var b in snapshot.val()[a]) {
                console.log(b);
                console.log(snapshot.val()[a][b])
                if (b == "software") {
                  for (var c in snapshot.val()[a][b]) {
                    this.switchgamearray.push(snapshot.val()[a][b][c]);
                  }
                } else if (b == "hardware") {
                  for (var c in snapshot.val()[a][b]) {
                    this.switcharray.push(snapshot.val()[a][b][c]);
                  }
                }
              }
            }

          }
          this.realswitcharray = this.switcharray[0].url;

          this.realpsarray = this.psarray[0].url;
          console.log(this.slides);
          console.log(this.switcharray)
          console.log(this.psarray);
          console.log(this.dsarray);
          console.log("ddddd")
        })
      })
    })
    this.OneSignalInstall();
  }

  logRatingChange(v) {
    console.log(v)
  }

  OneSignalInstall() {
    this.oneSignal.startInit('6505b348-1705-4d73-abe4-55ab40758266');
    console.log("onesignal-2-2");
    // this.oneSignal.clearOneSignalNotifications();
    console.log("onesignal 00");
    var iosSettings = {
      "kOSSettingsKeyAutoPrompt": true,
      "kOSSettingsKeyInAppLaunchURL": true
    };
    console.log("onesignal 11");
    this.oneSignal.iOSSettings(iosSettings);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    console.log("onesignal 22");
    console.log("onesiganl get id startedddddd")
    this.oneSignal.getIds().then(data => {
      console.log(data);
      console.log("get id success" + data.userId)
      if (this.id != null && this.id != undefined) {
        this.firemain.child("users").child(this.id).update({ "deviceId": data.userId })
        localStorage.setItem("tokenvalue", data.userId);
      }


    }).catch((e) => {
      // window.alert("onesignal error"+e);
      console.log("onesignal error : " + e);
    })
    this.oneSignal.endInit();
  }
  coinpoint() {
    if (this.loginflag == 'false' || this.loginflag == null) {

      this.confirmAlert("회원가입/로그인을 해주세요")
    } else {
      this.navCtrl.push(CoinsPage, { "id": this.id, "user": this.user });
    }
  }
  settings() {
    if ('false' == this.loginflag || this.loginflag == null) {
      this.confirmAlert("회원가입/로그인을 해주세요")
    } else {
      this.navCtrl.push(SettingPage, { "id": this.id, "user": this.user })
    }

  }
  go_chat() {
    if ('false' == this.loginflag || this.loginflag == null) {
      this.confirmAlert("회원가입/로그인을 해주세요")
    } else {
      this.firemain.child("admin").once('value').then((snap) => {
        this.navCtrl.push(ChatPage, { "user": this.user, "name": this.name, "admin": snap.val() }).then(() => {
          this.navCtrl.getActive().onDidDismiss(data => {
            firebase.database().ref('message').child(this.id).off();
          })
        })
      })

    }
  }

  mypage() {
    if ('false' == this.loginflag || this.loginflag == null) {
      this.confirmAlert("회원가입/로그인을 해주세요")
    } else {
      this.navCtrl.push(MypagePage, { "id": this.id, "user": this.user })
    }
    console.log("mypage come")

  }
  logout() {
    localStorage.setItem("key", null);
    localStorage.setItem("id", null);
    localStorage.setItem("loginflag", "false")
    this.navCtrl.setRoot(LoginpagePage);
  }
  confirmAlert2(str) {
    let alert = this.alertCtrl.create({
      subTitle: str,
      buttons: [
        {
          text: '확인',
          handler: () => {
            console.log('Buy clicked');
          }
        }],
      cssClass: 'alertDanger'
    });
    alert.present({ animate: false });
  }

  confirmAlert(str) {
    let alert = this.alertCtrl.create({
      subTitle: str,
      buttons: [
        {
          role: 'Cancel',
          text: '취소',
          handler: () => {
            console.log('Buy clicked');
          }
        },
        {
          role: 'Ok',
          text: '이동',
          handler: () => {
            this.navCtrl.push(LoginpagePage)
            console.log('Buy clicked');
          }
        }]

    });
    alert.present({ animate: false });
  }
  gotoshop(a) {
    console.log(a)
    console.log(a.flag);
    console.log(this.user)
    if (a.flag == "ds") {
      this.navCtrl.push(DetailPage, { "a": a, "game": this.dsgamearray, "setting": this.setting, "user": this.user, "sale": this.sale_data });
    }
    if (a.flag == "switch") {
      this.navCtrl.push(DetailPage, { "a": a, "game": this.switchgamearray, "setting": this.setting, "user": this.user, "sale": this.sale_data });
    }
    if (a.flag == "ps") {
      this.navCtrl.push(DetailPage, { "a": a, "game": this.psgamearray, "setting": this.setting, "user": this.user, "sale": this.sale_data });
    }
  }
  kakaoLogin() {
    this.navCtrl.push(LoginpagePage)
  }
  category2(v) {
    console.log("category!")
    this.selectedbutton = v;
    window.location.href = "#ps"
  }
}