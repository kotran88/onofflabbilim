import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';

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

  phone:any;
  name:any;
  constructor(public view:ViewController,public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
this.phone=this.navParams.get("id");
this.name=this.navParams.get("name");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccessPage');
  }
  dismissing(){
    this.navCtrl.setRoot(HomePage,{"id":this.phone,"name":this.name})  
  }
}
