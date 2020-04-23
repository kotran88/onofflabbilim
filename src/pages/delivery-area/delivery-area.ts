import { Component } from '@angular/core';
import { IonicPage,AlertController, Platform,NavController, NavParams, ViewController } from 'ionic-angular';
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

  Delivery:any;
  constructor(public alertCtrl:AlertController,public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {
    
    this.Delivery=this.navParams.get('Delivery');
    console.log(this.Delivery);
    
    let backAction =  platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    },2)

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

  adress_check(){
    this.Delivery.code =  $("#adress_A").val();
    this.Delivery.adress =  $("#adress_B").val();
    this.Delivery.detail_adress =  $("#adress_C").val();

    if(this.Delivery.adress.indexOf("전주")!=-1){
      this.Delivery.code =  $("#adress_A").val();
      this.Delivery.adress =  $("#adress_B").val();
      this.Delivery.detail_adress =  $("#adress_C").val();
    }
  }
  
  dismiss(){
    this.viewCtrl.dismiss();
  }

  check(){
    if(this.Delivery.name==='') this.confirmAlert2('수령인을 입력해주세요.');
    else if(this.Delivery.phone==='') this.confirmAlert2('연락처를 입력해주세요.');
    else if(this.Delivery.code==='') this.confirmAlert2('우편번호를 입력해주세요.');
    else if(this.Delivery.adress==='') this.confirmAlert2('주소를 입력해주세요.');
    else if(this.Delivery.detail_adress==='') this.confirmAlert2('상세주소를 입력해주세요.');
    else{
      var key=localStorage.getItem('id');
      this.firemain.child("users").child(key).child('adress').update({
        name:this.Delivery.name,
        phone:this.Delivery.phone,
        code:this.Delivery.code,
        adress:this.Delivery.adress,
        detail_adress:this.Delivery.detail_adress,
      })
      this.viewCtrl.dismiss(
        {
          name:this.Delivery.name,
          phone:this.Delivery.phone,
          code:this.Delivery.code,
          adress:this.Delivery.adress,
          detail_adress:this.Delivery.detail_adress,
        }
      )
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryAreaPage');
  }

}
