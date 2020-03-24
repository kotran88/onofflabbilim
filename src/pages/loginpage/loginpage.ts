import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import  firebase from 'firebase';
import { HomePage } from '../home/home';
import {IamportCordova} from '@ionic-native/iamport-cordova/'

import { SignupPage } from '../signup/signup';
/**
 * Generated class for the LoginpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-loginpage',
  templateUrl: 'loginpage.html',
})
export class LoginpagePage {

  main_title='';

  name='';
  phone='';
  code='';

  certified_check=false;
  login_check:any;
  phone_check=false;

  firemain = firebase.database().ref();
  constructor(public alertCtrl:AlertController,public fire:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
    
   
    if(localStorage.getItem('loginflag')==='true'){
      // this.main_title='회원가입/로그인';
      this.login_check=true;
      this.name=localStorage.getItem('name');
      this.phone=localStorage.getItem('id');
      console.log(this.name,this.phone);
      console.log("loginagain")
      if(this.name==null||this.phone==null){
        console.log("this.name and phone ==null")
        return;
      }else{
        this.loginagain();
      }
      
      // this.number=localStorage.getItem('number');
    }
    else{
      // this.main_title='회원가입/로그인';
      // this.login_check=false;
    }

    console.log(this.login_check)
  }

  goback(){
    this.phone_check=false;
    this.login_check=false;

  }

  certified(){
    if(this.name==='') alert('이름을 입력해주세요.');
    else if(this.phone==='') alert('휴대폰 번호를 입력해주세요.');
    else{
      this.certified_check=true;
    }
    if(this.certified_check){
      var userCode = 'imp10391932';
      var data = {
        merchant_uid: 'mid_' + new Date().getTime(),
        name:this.name,
        phone:this.phone, 
      };
      var params = {
        userCode: userCode,                           // 가맹점 식별코드
        data: data,                              // 결제 데이터
        callback: (response) =>{
          
          if(response.imp_success){
            window.alert("휴대전화 인증이 완료되었습니다");
            this.login();
            return;
           
          }
        },                           // 콜백 함수
      };
      IamportCordova.certification(params);

    }
  }

  login(){
    this.firemain.child('user').child(this.phone).update(
      {
        'name':this.name,
        'phone':this.phone,
        'first_login':new Date(),
        'points':1
      }
    )
    localStorage.setItem("loginflag","true");
    localStorage.setItem("id",this.phone);
    localStorage.setItem("name",this.name);
    this.navCtrl.setRoot(HomePage,{"id":this.phone,"name":this.name})
  }

  loginagain(){
    this.firemain.child('users').child(this.phone).update(
      {
        'name':this.name,
        'phone':this.phone,
        'last_login':new Date(),
      }
    )
    localStorage.setItem("loginflag","true");
    localStorage.setItem("id",this.phone);
    localStorage.setItem("name",this.name);
    this.navCtrl.setRoot(HomePage,{"id":this.phone,"name":this.name})
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginpagePage');
  }
}
