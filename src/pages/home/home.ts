import { Component,NgZone,ViewChild } from '@angular/core';
import { IamportCordova } from '@ionic-native/iamport-cordova';
import {DetailPage} from './../detail/detail'
import { IonicPage, ToastController,Slides,ModalController,ViewController,Events,Platform,App,AlertController,NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

// import { Geolocation } from '@ionic-native/geolocation/';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { MypagePage} from './../../pages/mypage/mypage';
import { LoginpagePage} from './../../pages/loginpage/loginpage';
import { ChatPage } from '../chat/chat';
import { CoinsPage } from '../coins/coins';

import { SettingPage } from '../setting/setting';
import { FirstlandingPage } from '../firstlanding/firstlanding';


declare var naver: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Slides) slidess: Slides;
  selectedbutton:any='vr'
  name:any;
  logined:any="false"
  firemain = firebase.database().ref();
  slides=[];
  switcharray=[];
  dsarray=[];
  psarray=[];
  dsgamearray=[];
  switchgamearray=[];
  psgamearray=[];
  lat:any;
  lng:any;
  setting:any;
  id:any;
  version:any;
  realswitcharray:any;
  loginflag:any;
  userid:any;
  realpsarray:any;
  user:any;
  counter:any=0;
  ionViewWillEnter(){
    
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: '한번 더 뒤로가기를 누르면 앱이 종료됩니다.',
      duration: 2000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  constructor(private toastCtrl: ToastController,public modal:ModalController,public view:ViewController,public platform:Platform,public app:App,public appVersion : AppVersion,public event:Events,public oneSignal:OneSignal,public zone:NgZone,public alertCtrl:AlertController,public navParam:NavParams,public navCtrl:NavController) {
    localStorage.setItem('id','01079998598')
    this.id=localStorage.getItem("id")
    this.name=localStorage.getItem("name")
    this.loginflag=localStorage.getItem("loginflag");
    if(this.loginflag=='false'||this.loginflag==null){
      let modal = this.modal.create(FirstlandingPage,{},{ cssClass: 'test-modal' });
      modal.onDidDismiss(data => {
        if(data!=undefined){
          console.log(data);
  
          // this.uploadImageToFirebase(data);
        }
       
      });
      modal.present();
    }
    platform.registerBackButtonAction(() => {

      let nav = this.app.getActiveNav();
      let activeView = nav.getActive();
      console.log("back presseddd");

      if (this.counter == 0) {
        this.counter++;
        this.presentToast();
        setTimeout(() => { this.counter = 0 }, 2000)
      } else {
        // console.log("exitapp");
        this.platform.exitApp();
      }
    });
  
  
    this.event.subscribe('star-rating:changed', (starRating) => {console.log(starRating)});
 
    console.log(this.id);
    console.log(this.loginflag);
    console.log(this.userid);

    this.zone.run(()=>{
      console.log("id is : "+this.id);
      
      this.firemain.child("users").child(this.id).once("value",(snapshot)=>{
        console.log(snapshot.val());
        this.user=snapshot.val();
        console.log("user");
        console.log(this.user);
      })
     
      this.firemain.child("setting").once("value",(snapshot)=>{
        for(var a in snapshot.val()){
          if(a=="expressmessage"){
            this.setting=snapshot.val()[a];
          }
          if(a=="version"){
            this.version=snapshot.val()[a];
          }
          console.log(snapshot.val()[a]);
        }


      var versionnumber="";
      this.appVersion.getVersionNumber().then(version => {
        versionnumber = version;


      if(Number(this.version)>Number(versionnumber)){
        window.alert("버전이다름!")
      }

        });

       

      })
      this.firemain.child("category").once("value",(snapshot)=>{
      //  this.slides.push({"url":"https://firebasestorage.googleapis.com/v0/b/bilim-fd9b0.appspot.com/o/promotion%2Fbgimage2.jpeg?alt=media&token=5cd0eef0-0d47-4b8d-9a1b-2fd099c0f2a6"})
      //   this.slides.push({"url":"https://firebasestorage.googleapis.com/v0/b/bilim-fd9b0.appspot.com/o/promotion%2Fbgimage3.jpeg?alt=media&token=fed88c4d-53f2-4c38-a81f-ac1f88511746"})
       
        for(var a in snapshot.val()){
          console.log(a)
          if(a=="promotion"){
            for(var b in snapshot.val()[a]){

              this.slides.push(snapshot.val()[a][b])
            }
          }
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
        this.realswitcharray=this.switcharray[0].url;

        this.realpsarray=this.psarray[0].url;
        console.log(this.slides);
        console.log(this.switcharray)
        console.log(this.psarray);
        console.log(this.dsarray);
        console.log("ddddd")
      })
    })
   this.OneSignalInstall();
  }

// getGeo(){
//   console.log("get geo come");
//   var options = {
//     timeout: 20000,
//     enableHighAccuracy: false
//     }

//   this.geo.getCurrentPosition(options).then((success)=>{

//     console.log(success);
//     this.lat=success.coords.latitude;
//     this.lng=success.coords.longitude; 
//     // this.lat=37.565924;
//     // this.lng=126.976895;
//     console.log("currentlocatipn"+this.lat+"///"+this.lng);

  
//     naver.maps.Service.reverseGeocode({
//       location: new naver.maps.LatLng(this.lat, this.lng),
//   }, (status,response)=> {
//       if (status !== naver.maps.Service.Status.OK) {
//         console.log("status not ok");
//           console.log(status);
//       }else{
//         console.log("status  ok");
//         console.log(status);
//       }
//     })
//   });
// }
  
  logRatingChange(v){
    console.log(v)
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
      this.firemain.child("users").child(this.id).update({"deviceId":data.userId})
      localStorage.setItem("tokenvalue",data.userId);

    }).catch((e)=>{
      // window.alert("onesignal error"+e);
      console.log("onesignal error : "+e);
    })
    this.oneSignal.endInit();
  }
  coinpoint(){
    if(this.loginflag=='false'||this.loginflag==null){

      this.confirmAlert("회원가입/로그인을 해주세요")
    }else{
      this.navCtrl.push(CoinsPage,{"id":this.id,"user":this.user});
    }
   
      }
      settings(){
        if('false'==this.loginflag||this.loginflag==null){
          this.confirmAlert("회원가입/로그인을 해주세요")
        }else{
          this.navCtrl.push(SettingPage,{"id":this.id,"user":this.user})
        }
      
      }
  go_chat(){

    if('false'==this.loginflag||this.loginflag==null){
      this.confirmAlert("회원가입/로그인을 해주세요")
    }else{
      this.navCtrl.push(ChatPage,{"id":this.id}).then(() => {
        this.navCtrl.getActive().onDidDismiss(data => {
          firebase.database().ref('message').child(this.id).off();
        })
      })
    }
  
  }

  mypage(){
    if('false'==this.loginflag||this.loginflag==null){
      this.confirmAlert("회원가입/로그인을 해주세요")
    }else{
      this.navCtrl.push(MypagePage,{"id":this.id,"user":this.user})
    }
    console.log("mypage come")
    
  }
  logout(){
    localStorage.setItem("key",null);
    localStorage.setItem("id",null);
    localStorage.setItem("loginflag","false")
    this.navCtrl.setRoot(LoginpagePage);
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

  confirmAlert(str) {
    let alert = this.alertCtrl.create({
        subTitle: str,
        buttons: [  
          {
            role:'Cancel',
            text: '취소',
            handler: () => {
              console.log('Buy clicked');
            }
          },
        {
          role:'Ok',
          text: '이동',
          handler: () => {
            this.navCtrl.push(LoginpagePage)
            console.log('Buy clicked');
          }
        }]
       
    });
    alert.present({animate:false});
  }
  gotoshop(a){
    console.log(a)
    console.log(a.flag);
    console.log(this.user)
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
  // onClickCertification() {
  //   var userCode = 'imp10391932';
  //   var data = {
  //     merchant_uid: 'mid_' + new Date().getTime(),
  //   };
  //   var params = {
  //     userCode: userCode,                           // 가맹점 식별코드
  //     data: data, 
  //     name:"홍길동",
  //     phone:"010-7999-8598",                              // 결제 데이터
  //     callback: function(response) {console.log(response); alert(JSON.stringify(response)); },                           // 콜백 함수
  //   };
  //   IamportCordova.certification(params);
  // }
  category2(v){
    console.log("category!")
    this.selectedbutton=v;
    window.location.href="#ps"
  }
}
