import { Component } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams } from 'ionic-angular';
import { LoginpagePage} from './../loginpage/loginpage'
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

  constructor(public platform:Platform,public navCtrl: NavController, public navParams: NavParams) {
    let backAction =  platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    },2)

  }

  goback(){
    this.navCtrl.pop();
  }
  logout(){
    localStorage.setItem("loginflag","false");
    this.navCtrl.setRoot(LoginpagePage)
  }
}
