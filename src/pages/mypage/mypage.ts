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
user:any;
point:any;

firemain = firebase.database().ref();
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id=navParams.get("id")
    this.user=navParams.get("user");
    console.log(this.id,this.user)
    if(this.user.point==undefined){
      this.point=0;
    }else{
      this.point=this.user.point;
    }
    console.log(this.id,this.userid);
    console.log("user is : ");
    console.log(this.user);
    this.firemain.child("users").child(this.id).child("orderlist").once("value",(snap)=>{
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
  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
}
}
