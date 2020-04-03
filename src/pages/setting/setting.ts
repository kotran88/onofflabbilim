import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginpagePage } from './../loginpage/loginpage'
import firebase from 'firebase';
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  firemain = firebase.database().ref();
  id : any;
  user : any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    let backAction = platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    }, 2)

    this.id=this.navParams.get("id");
    this.user=this.navParams.get("user");
    console.log(this.id);
    console.log(this.user);
  }

  goback() {
    this.navCtrl.pop();
  }
  logout() {
    // this.navCtrl.setRoot(LoginpagePage)
    let alert = this.alertCtrl.create({
      title: '로그아웃 하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '확인',
          handler: data => {
            localStorage.setItem("loginflag", "false");
            this.navCtrl.pop();
            window.alert("로그아웃 되었습니다.");
          }
        }
      ]
    });
    alert.present();
  }
  
  withdraw(){
    let alert = this.alertCtrl.create({
      title: '정말로 탈퇴하실건가요?',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '확인',
          handler: data => {
            localStorage.setItem("loginflag", "false");
            this.firemain.child("users").child(this.id).remove();
            window.alert("그동안 MING을 이용해주셔서 감사합니다.");
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  alertsetting(){
    let alert = this.alertCtrl.create({
      title: '알람을 설정하시겠어요?',
      buttons: [
        {
          text: '허용',
          // role: 'cancel',
          handler: data => {
            this.firemain.child("users").child(this.id).push({"alert":true});
            window.alert("알람 ON")
          }
        },
        {
          text: '거부',
          handler: data => {
            this.firemain.child("users").child(this.id).push({"alert":false});
            window.alert("알람 OFF")
          }
        }
      ]
    });
    alert.present();

  }
}
