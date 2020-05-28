import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';




/**
 * Generated class for the CameraselectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modalbottom',
  templateUrl: 'modalbottom.html',
})
export class Modalbottom {
  imagePicker:any;
  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
  }
  takePhoto(){
    console.log("Take photo!!!!");
  
  }
  getPhoto(){
    console.log("get photo come ");
   
  }
  getSinglePhoto(){
    
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraselectPage');
  }
  confirm(){
    this.viewCtrl.dismiss();
  }

}
