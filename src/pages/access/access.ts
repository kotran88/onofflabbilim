import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-access',
  templateUrl: 'access.html',
})
export class AccessPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {

    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 2000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccessPage');
  }

}
