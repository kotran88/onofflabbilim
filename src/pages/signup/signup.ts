import { Component } from '@angular/core';
import {  AlertController,NavController, NavParams, ViewController } from 'ionic-angular';
import  firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginpagePage } from '../loginpage/loginpage';
import { HomePage } from '../home/home';

import { IamportCordova } from '@ionic-native/iamport-cordova';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  firemain = firebase.database().ref();
  name:any;
  stage=1;
  residence='';
  sex='';
  id='';
  birth_year='';
  password='';
  password2='';
  phone:any;
  years=[];
  check=[false];

  id_checker=false;
  password_checker=false;
  phone_checker=null;
  
  constructor(public firebaseAuth:AngularFireAuth,public viewCtrl:ViewController,
    public alertCtrl:AlertController,public navCtrl: NavController, public navParams: NavParams) {
    
    var now=new Date();
    for(var i=1950;i<=now.getFullYear();i++){
      this.years.push(i);
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  passwordcheck(){
    this.password_checker=false;
    if(this.password===this.password2){
      this.password_checker=true;
    }
  }

  checker_roop(n1,n2,val){
    
    for(var i=n1;i<=n2;i++){
      this.check[i]=val;
    }

    if(this.check[1]===true&&this.check[2]===true&&this.check[3]===true){
      this.check[0]=true;
    }
    else this.check[0]=false;
  }

  checker(num){
  
    if(num===0){
      this.checker_roop(1,3,this.check[0]);
    }
    else if(num===1){
      this.checker_roop(1,1,this.check[1])
    }
    else if(num===2){
      this.checker_roop(2,2,this.check[2])
    }
    else if(num===3){
      this.checker_roop(3,3,this.check[3])
    }
  }
cert(){
  var userCode = 'imp10391932';
  var data = {
    merchant_uid: 'mid_' + new Date().getTime(),
    name:"홍길동",
    phone:"010-7999-8598",      
    carrier:"SKT"
  };
  var params = {
    userCode: userCode,                           // 가맹점 식별코드
    data: data, 
                            // 결제 데이터
    callback: function(response) {
      

      if(response.imp_success=="true"){


        setTimeout(()=>{
            var a = this.firemain.child("users").push().key;
            this.firemain.child("users").child(a).update({"key":a,"point":0,"email":this.email,"first_login":new Date()})
            window.alert("success first login")
        },500)


        return "true";
      }

      alert(JSON.stringify(response)); },                           // 콜백 함수
  };
  IamportCordova.certification(params);
}
  phonecheck(){
    this.phone_checker=null;

    
    
    return true;
  }

  nextstep(){

    this.phone=this.phone.split('-');
    if(this.phone[1]===undefined){
      this.phone=this.phone[0];
    }
    else{
      this.phone=this.phone[0]+this.phone[1]+this.phone[2];
    }

    if(this.id!=''&&this.password!=''&&this.phone!=''){
      this.phone_checker=null;
      this.firemain.child('users').once("value", (snap) => {
        console.log(snap.val())
        for(var id in snap.val()){
          console.log(snap.val()[id].phone);
          if(snap.val()[id].phone===this.phone){
            this.phone_checker=false;
          }
        }
        if(this.phone_checker===null) this.phone_checker=true;

      }).then(()=>{
        console.log("then come")
        this.passwordcheck();

        console.log(this.password_checker);
        if(this.password_checker){
          var a = this.firemain.child("users").push().key;
          this.firebaseAuth.auth.createUserWithEmailAndPassword(this.id, this.password).then( (data)=> {
            this.firemain.child("users").child(a).update({"key":a,"point":0,"email":this.id,"phone":this.phone,"name":this.name,"first_login":new Date()})
            window.alert("회원가입완료");
            this.navCtrl.setRoot(LoginpagePage)
          });
        }
      })
    }
    else{
      window.alert('비어있는 공간이 있습니다.');
    }
  }

  create_account(){
    console.log(this.residence);
    console.log(this.sex);
    console.log(this.id);
    console.log(this.birth_year);
    console.log(this.password);
    console.log(this.password2);
    console.log(this.phone);
    console.log(this.check);


    if(this.check[1]===false){
      window.alert('이용약관 동의가 필요합니다.');
    }
    else if(this.check[2]===false){
      window.alert('개인정보 수집 및 이용 동의가 필요합니다.');
    }
    else{
      this.firebaseAuth.auth.createUserWithEmailAndPassword(this.id, this.password).then( (data)=> {
        
        this.firemain.child('user').child(this.id.split('.com')[0]+'com').update(
          {
            id:this.id,
            password:this.password,
            residence:this.residence,
            sex:this.sex,
            birth_year:this.birth_year,
            terms:this.check,
            phone:this.phone,
          }
        ).then(()=>{
          window.alert('signup successed')
          this.viewCtrl.dismiss();
        })

      }).catch(function (error) {
          console.log(error);
          alert("signup failed : " + error);
      });
    }
  }
}
