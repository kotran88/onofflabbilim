import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TspagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-tspage',
  templateUrl: 'tspage.html',
})
export class TspagePage {

  game:any;
  console:any;

  select_list:any;
  select_num:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TspagePage');
  }

}
