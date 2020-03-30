import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams } from 'ionic-angular';

import { LoginpagePage} from './../../pages/loginpage/loginpage';
/**
 * Generated class for the FirstlandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-firstlanding',
  templateUrl: 'firstlanding.html',
})

export class FirstlandingPage {

  constructor(public view:ViewController,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirstlandingPage');
  }
  canceling(){
    this.view.dismiss();
  }
  gotologin(){
    this.navCtrl.push(LoginpagePage)
  }
}
