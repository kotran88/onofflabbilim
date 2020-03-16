import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as $ from 'jquery'
import firebase from 'firebase';

/**
 * Generated class for the DeliveryAreaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-delivery-area',
  templateUrl: 'delivery-area.html',
})
export class DeliveryAreaPage {

  firemain = firebase.database().ref();

  name='';
  phone='';
  adress='';
  adress2='';
  adress3='';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {
  }

  adress_check(){
    this.adress =  $("#adress_A").val();
    this.adress2 =  $("#adress_B").val();
    this.adress3 =  $("#adress_C").val();
  }
  

  check(){
    var key=localStorage.getItem('key');
    this.firemain.child("users").child(key).child('adress').update({
      name:this.name,
      phone:this.phone,
      code:this.adress,
      adress:this.adress2,
      detail_adress:this.adress3,
    })
    this.viewCtrl.dismiss(
      {
        name:this.name,
        phone:this.phone,
        code:this.adress,
        adress:this.adress2,
        detail_adress:this.adress3,
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryAreaPage');
  }

}
