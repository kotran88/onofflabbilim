import { Component, ViewChild } from '@angular/core';
import { Platform ,ViewController,App,AlertController, Nav, MenuClose, Modal, ModalController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen';

import { MypagePage} from '../pages/mypage/mypage'
import { ChatPage } from '../pages/chat/chat';
import {TspagePage} from '../pages/tspage/tspage'
import { LoginpagePage } from '../pages/loginpage/loginpage';
import { SettingPage } from '../pages/setting/setting';
import { CoinSavePage } from '../pages/coin-save/coin-save';
import * as firebase from "firebase";
import { IntroducePage } from '../pages/introduce/introduce';
import { HomeslidePage } from '../pages/homeslide/homeslide';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = HomePage;
  // rootPage:any=MypagePage;
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Modal) modal: Modal;
  rootPage:any=TspagePage;
  app:any;
  id:any;
  user:any;

  firemain=firebase.database().ref();

  pages:Array<{title:string,component:any}>;
  constructor(app : App,public alertCtrl:AlertController,public statusBar: StatusBar,public platform: Platform) {
    this.app=app;
    this.platform.ready().then(() => {
      if(this.platform.is('android') ) {
        this.statusBar.backgroundColorByHexString('#ffffff');
      };
    });

    var loginflag=localStorage.getItem('loginflag');

    console.log("login flag is : "+loginflag);
    if(loginflag===''||loginflag==='false'||loginflag===undefined||loginflag===null){
      this.pages=[
        {title:'로그인',component:LoginpagePage},
        // {title:'SETTING',component:SettingPage},
        // {title:'COIN',component:CoinSavePage},
      ]
    }
    else{
      this.id=localStorage.getItem('id');
      this.firemain.child('users').child(this.id).once('value').then((snap)=>{
        console.log(snap.val());
        this.user=snap.val();
        this.pages=[
          {title:'주문관리',component:MypagePage},

          {title:'코인관리',component:CoinSavePage},
          {title:'문의하기',component:ChatPage},
          {title:'이용안내',component:HomeslidePage},
          {title:'로그아웃',component:'logout'},
          // {title:'SETTING',component:SettingPage},
          // {title:'COIN',component:CoinSavePage},
        ]
      })
    }
  }

  openPage(page){

    if(page.component==='logout'){
      this.logout();
    }
    else if(page.component===HomeslidePage){
      this.nav.push(HomeslidePage,{});
    }
    else {
      this.nav.push(page.component,{user:this.user})
    }
  }

  gosetting(){
    this.openPage({component:SettingPage})
  }

  logout() {
    let alert = this.alertCtrl.create({
      title: '로그아웃 하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '확인',
          handler: data => {
            localStorage.setItem("loginflag", "false");
            localStorage.setItem("id", "");
            window.alert("로그아웃 되었습니다.")
            // this.nav.setRoot(TspagePage);
            location.reload();
            // this.confirmAlert2("로그아웃 되었습니다.");
          }
        }
      ]
    });
    alert.present();
  }
}

