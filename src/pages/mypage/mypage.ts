import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { ChatPage } from '../chat/chat';

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
      var cnt=0;
      for(var a in snap.val()){
        console.log(snap.val()[a].hardware.flag);
        this.orderlist.push(snap.val()[a]);
        // this.dateck(cnt)
        // this.orderlist[cnt].phone=snap.val().phone;
        cnt++;
      }
      console.log(this.orderlist);
    })
    console.log(this.id,this.userid);
  }

  go_chat(){
    this.navCtrl.push(ChatPage,{"id":this.id})
  }

  dateck(n){
    this.orderlist[n].orderdate=
    this.orderlist[n].orderdate.split(' ')[0]+'T'+
    this.orderlist[n].orderdate.split(' ')[1];

    if(Number(this.orderlist[n].orderdate.split('T')[0].split('-')[1])<10){
      this.orderlist[n].orderdate=
      this.orderlist[n].orderdate.split('T')[0].split('-')[0]+'-+'+
      this.orderlist[n].orderdate.split('T')[0].split('-')[1]+'-'+
      this.orderlist[n].orderdate.split('T')[0].split('-')[2]+
      this.orderlist[n].orderdate.split('T')[1];
    }

    if(Number(this.orderlist[n].orderdate.split('T')[0].split('-')[2])<10){
      this.orderlist[n].orderdate=
      this.orderlist[n].orderdate.split('T')[0].split('-')[0]+'-'+
      this.orderlist[n].orderdate.split('T')[0].split('-')[1]+'-+'+
      this.orderlist[n].orderdate.split('T')[0].split('-')[2]+
      this.orderlist[n].orderdate.split('T')[1];
    }

    for(var i=0;i<this.orderlist[n].orderdate.length;i++){
      if(this.orderlist[n].orderdate[i]==='+'){
        this.orderlist[n].orderdate[i]=' ';
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MypagePage');
  }
  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
  }
}
