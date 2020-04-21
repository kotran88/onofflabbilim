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

  name='';
  phone='';
  adress='';
  adress2='';
  adress3='';
  constructor(public alertCtrl:AlertController,public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {
    this.name=this.navParams.get("name");
    this.phone=this.navParams.get("phone");
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
    this.adress =  $("#adress_A").val();
    this.adress2 =  $("#adress_B").val();
    this.adress3 =  $("#adress_C").val();

    if(this.adress2.indexOf("전주")!=-1){
      this.adress =  $("#adress_A").val();
      this.adress2 =  $("#adress_B").val();
      this.adress3 =  $("#adress_C").val();
    }
  }
  
  dismiss(){
    this.viewCtrl.dismiss();
  }

  check(){
    if(this.name==='') this.confirmAlert2('수령인을 입력해주세요.');
    else if(this.phone==='') this.confirmAlert2('연락처를 입력해주세요.');
    else if(this.adress==='') this.confirmAlert2('우편번호를 입력해주세요.');
    else if(this.adress2==='') this.confirmAlert2('주소를 입력해주세요.');
    else if(this.adress3==='') this.confirmAlert2('상세주소를 입력해주세요.');
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
