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
    if(this.name==='') alert('수령인을 입력해주세요.');
    else if(this.phone==='') alert('연락처를 입력해주세요.');
    else if(this.adress==='') alert('우편번호를 입력해주세요.');
    else if(this.adress2==='') alert('주소를 입력해주세요.');
    else if(this.adress3==='') alert('상세주소를 입력해주세요.');
    else{
      var key=localStorage.getItem('id');
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryAreaPage');
  }

}
