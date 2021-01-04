import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import * as firebase from "firebase";
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

    // this.id=this.navParams.get("id");
    this.user=this.navParams.get("user");
    this.id=this.user.phone;
    console.log(this.id);
    console.log(this.user);
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
    alert.present({animate:false});
  }

  goback() {
    this.navCtrl.pop();
  }
  logout() {
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
            this.confirmAlert2("로그아웃 되었습니다.");
            location.reload();
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
            this.confirmAlert2("그동안 MING을 이용해주셔서 감사합니다.");
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
            this.firemain.child("users").child(this.id).update({"alert":true});
            this.confirmAlert2("알람 ON")
          }
        },
        {
          text: '거부',
          handler: data => {
            this.firemain.child("users").child(this.id).update({"alert":false});
            this.confirmAlert2("알람 OFF")
          }
        }
      ]
    });
    alert.present();

  }
}
