import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the MypagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MypagePage {
id:any;
userid:any;
orderlist=[];
firemain = firebase.database().ref();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id=navParams.get("id")
    this.userid=navParams.get("key");
    this.firemain.child("users").child(this.userid).child("orderlist").once("value",(snap)=>{
      for(var a in snap.val()){
        console.log(snap.val()[a].hardware.flag);
        this.orderlist.push(snap.val()[a]);
      }
      console.log(this.orderlist);
    })
   
    console.log(this.id,this.userid);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MypagePage');
  }
}
