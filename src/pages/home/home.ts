import { Component,NgZone } from '@angular/core';
import { IamportCordova } from '@ionic-native/iamport-cordova';
import { KakaoCordovaSDK, AuthTypes } from 'kakao-sdk/ngx';
import {DetailPage} from './../detail/detail'
import { IonicPage, AlertController,NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

import { OneSignal } from '@ionic-native/onesignal/ngx';
import { MypagePage} from './../../pages/mypage/mypage';
import { LoginpagePage} from './../../pages/loginpage/loginpage';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedbutton:any='vr'

  logined:any="false"
  firemain = firebase.database().ref();
  slides=[];
  switcharray=[];
  dsarray=[];
  psarray=[];
  dsgamearray=[];
  switchgamearray=[];
  psgamearray=[];
  setting:any;
  id:any;
  loginflag:any;
  userid:any;
  user:any;
  constructor(public oneSignal:OneSignal,public zone:NgZone,public alertCtrl:AlertController,public navParam:NavParams,public navCtrl:NavController,public _kakaoCordovaSDK: KakaoCordovaSDK) {
    this.id=localStorage.getItem("id")
    this.loginflag=localStorage.getItem("loginflag");
    this.userid=localStorage.getItem("key");
    // this.id="kotran88@gmail.com";

    console.log(this.id);
    console.log(this.loginflag);
    console.log(this.userid);

    this.zone.run(()=>{
      console.log(this.userid);
      if(this.userid!=null){
        this.firemain.child("users").child(this.userid).once("value",(snapshot)=>{
          console.log(snapshot.val());
          this.user=snapshot.val();
        })
      }
     
      this.firemain.child("setting").once("value",(snapshot)=>{
        for(var a in snapshot.val()){
          if(a=="expressmessage"){
            this.setting=snapshot.val()[a];
          }
          console.log(snapshot.val()[a]);
        }
      })
      this.firemain.child("category").once("value",(snapshot)=>{
        for(var a in snapshot.val()){
          console.log(a)
          if(a=="promotion"){
            for(var b in snapshot.val()[a]){
              this.slides.push(snapshot.val()[a][b])
            }
          }
          // if(a=="switch"){
          //   for(var b in snapshot.val()[a]){
          //     this.switcharray.push(snapshot.val()[a][b])
          //   }
          // }
          if(a=="ps"){
            for(var b in snapshot.val()[a]){
              console.log(b);
              console.log(snapshot.val()[a][b])
              if(b=="software"){
                for(var c in snapshot.val()[a][b]){
                  this.psgamearray.push(snapshot.val()[a][b][c]);
                }
              }
              else if(b=="hardware"){
                for(var c in snapshot.val()[a][b]){
                  this.psarray.push(snapshot.val()[a][b][c]);
                }
              }
            }
          }
          if(a=="switch"){
            for(var b in snapshot.val()[a]){
              console.log(b);
              console.log(snapshot.val()[a][b])
              if(b=="software"){
                for(var c in snapshot.val()[a][b]){
                  this.switchgamearray.push(snapshot.val()[a][b][c]);
                }
              }else if(b=="hardware"){
                for(var c in snapshot.val()[a][b]){
                  this.switcharray.push(snapshot.val()[a][b][c]);
                }
                
              }
             
              
            }
          }
        
        }
        console.log(this.slides);
        console.log(this.switcharray)
        console.log(this.psarray);
        console.log(this.dsarray);
        console.log("ddddd")
      })
    })
   this.OneSignalInstall();
  }


  OneSignalInstall()
  {
    this.oneSignal.startInit('6505b348-1705-4d73-abe4-55ab40758266');
    console.log("onesignal-2-2");
    // this.oneSignal.clearOneSignalNotifications();
    console.log("onesignal 00");
    var iosSettings = {
      "kOSSettingsKeyAutoPrompt" : true,
      "kOSSettingsKeyInAppLaunchURL" : true
    };
    console.log("onesignal 11");
    this.oneSignal.iOSSettings(iosSettings);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    console.log("onesignal 22");

    console.log("onesiganl get id startedddddd")
    this.oneSignal.getIds().then(data => {
      console.log(data);
      console.log("get id success"+data.userId)

      window.alert(data.userId);
      localStorage.setItem("tokenvalue",data.userId);

    }).catch((e)=>{
      // window.alert("onesignal error"+e);
      console.log("onesignal error : "+e);
    })
    this.oneSignal.endInit();
  }

  mypage(){
    console.log("mypage come")
    this.navCtrl.push(MypagePage,{"id":this.id,"key":this.userid})
  }
  logout(){
    localStorage.setItem("key",null);
    localStorage.setItem("id",null);
    localStorage.setItem("loginflag","false")
    this.navCtrl.setRoot(LoginpagePage);
  }
  confirmAlert(str) {
    let alert = this.alertCtrl.create({      
        subTitle: str,
        buttons: ['확인']
    });
    alert.present({animate:false});
  }
  gotoshop(a){
    console.log(a.flag);
    if(a.flag=="ds"){
      this.navCtrl.push(DetailPage,{"a":a,"game":this.dsgamearray,"setting":this.setting,"user":this.user});
    }
    if(a.flag=="switch"){
      this.navCtrl.push(DetailPage,{"a":a,"game":this.switchgamearray,"setting":this.setting,"user":this.user});
    }
    if(a.flag=="ps"){
      this.navCtrl.push(DetailPage,{"a":a,"game":this.psgamearray,"setting":this.setting,"user":this.user});
    }
  }
  kakaoLogin(){
    this.navCtrl.push(LoginpagePage)
  }
  onClickCertification() {
    var userCode = 'imp10391932';
    var data = {
      merchant_uid: 'mid_' + new Date().getTime(),
    };
    var params = {
      userCode: userCode,                           // 가맹점 식별코드
      data: data, 
      name:"홍길동",
      phone:"010-7999-8598",                              // 결제 데이터
      callback: function(response) {console.log(response); alert(JSON.stringify(response)); },                           // 콜백 함수
    };
    IamportCordova.certification(params);
  }
  category2(v){
    console.log("category!")
    this.selectedbutton=v;
    window.location.href="#ps"
  }
}
