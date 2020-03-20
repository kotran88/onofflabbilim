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
    
    localStorage.setItem('loginflag','false');

    if(localStorage.getItem('loginflag')==='true'){
      // this.main_title='회원가입/로그인';
      this.login_check=true;
      this.name=localStorage.getItem('name');
      this.phone=localStorage.getItem('phone');
      // this.number=localStorage.getItem('number');
    }
    else{
      this.main_title='회원가입/로그인';
      this.login_check=false;
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
  }

  login(){
    this.login2();
    // if(this.name==='') alert('이름을 입력해주세요.');
    // else if(this.phone==='') alert('휴대폰 번호를 입력해주세요.');
    // else if(this.code==='') alert('인증번호를 입력해주세요.');
    // else{
    //   this.firemain.child('users2').child(this.phone).once("value",(snap)=>{
    //     if(snap.val()){
    //       this.phone_check=true;
    //       this.main_title="계정 확인"
    //     }
    //     else this.login_check=true;
    //   }).then(()=>{

    //     if(this.phone_check===true){
    //       // alert()
    //     }
    //     else{
    //       this.login2();
    //     }
    //   })
    // }
  }

  login2(){
    this.firemain.child('users2').child(this.phone).update(
      {
        'name':this.name,
        'phone':this.phone,
        'last_login':new Date(),
      }
    )
    alert('로그인!!!!');
    this.navCtrl.setRoot(HomePage,{"id":'kotraner88@gmail.com'})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginpagePage');
  }
}
