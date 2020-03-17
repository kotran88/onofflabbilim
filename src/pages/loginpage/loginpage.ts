import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import  firebase from 'firebase';
import { HomePage } from '../home/home';
import {IamportCordova} from '@ionic-native/iamport-cordova/'

import { KakaoCordovaSDK, AuthTypes } from 'kakao-sdk/ngx';
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

  ValidateFlag:any=false;
  id:any;
  password:any;
  check=false;

  firemain = firebase.database().ref();
  constructor(public _kakaoCordovaSDK: KakaoCordovaSDK,public alertCtrl:AlertController,public fire:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
    if(localStorage.getItem("loginflag")==='true'){
      console.log('auto login');
    }

  
    console.log(localStorage.getItem("loginflag"));

    this._kakaoCordovaSDK.logout();
    this._kakaoCordovaSDK.unlinkApp();
  }
  kakaologin(){
    //"AUTHORIZATION_FAILED: invalid android_key_hash or ios_bundle_id or web_site_url"
    //cordova plugin add cordova-plugin-kakao-sdk --variable KAKAO_APP_KEY=9f499919aa20afde90187485d80f06d2
    console.log("kakaologin")
    var values = {
      targetScopes: ['account_email', 'age_range', 'gender'],
    };
    var key="";
    var flag=false;
    let loginOptions = {};
    loginOptions['authTypes'] = [
                                  AuthTypes.AuthTypeTalk, 
                                  AuthTypes.AuthTypeStory,
                                  AuthTypes.AuthTypeAccount
                                ];
                            
    this._kakaoCordovaSDK.login(loginOptions).then((res) => {
        console.log(res);

    localStorage.setItem("loginflag","true")
        console.log(res.kakao_account.email)
        this.firemain.child("users").once("value",(snap)=>{
          console.log(snap.val());
          
          for(var a in snap.val()){
            console.log(snap.val()[a].email);
            if(res.kakao_account.email==snap.val()[a].email){
              flag=true;
              key=snap.val()[a].key;
            }
          }
          if(flag){
            //이미 로그인됨
            window.alert("gotomain"+key);
            this.firemain.child("users").child(key).update({"last_login":new Date()})
        }else{
          window.alert("first login")
          //최초 로그인
          var ab="false";
          setTimeout(() => {
            ab =this.certificating(res.kakao_account.email);
          }, 1000);
          
          
        }
        })
    
      
        // this.navCtrl.setRoot(HomePage);
    
    window.alert("done")
  }
    ).catch((e)=>{
      console.log(e);
      window.alert(e.errorCode);
    })
  }

  confirmAlert(str){
    var alert = this.alertCtrl.create({
      subTitle: str,
      buttons: ['확인']
  });
  alert.present({ animate: false });
  }
  find_admin(){
  }
  signup(){
    this.navCtrl.push(SignupPage)
  }
  validate(){
    var str = '';
    if (this.id == '') {
        str = '아이디를 입력해주세요.';
        this.confirmAlert(str);
        return false;
    }
    if (this.password == '') {
        str = '비밀번호를 입력해주세요.';
        this.confirmAlert(str);
        return false;
    }
    this.ValidateFlag = true;
    return true;
  }
  login(){
    if (!this.validate()) {
        return false;
    }
    if (this.ValidateFlag == true){
      // this.login_success();
    }
        
    console.log(this.id);
    console.log(this.password);
    this.fire.auth.signInWithEmailAndPassword(this.id, this.password)
        .then( (data)=> {
        this.login_success(this.id);
    }).catch(function (error) {
        console.log(error);
        alert("login failed" + error);
    });
  }

  login_success(id){
    localStorage.setItem("loginflag","true")
    localStorage.setItem("id",id)
    console.log('login success')
    console.log(id+'check',this.check)
    
    // this.id=localStorage.getItem('id');
    var key="";
    var flag=false;
    this.firemain.child("users").once("value",(snap)=>{
      console.log(snap.val());
      
      for(var a in snap.val()){
        console.log(snap.val()[a].email);
        if(id==snap.val()[a].email){
          flag=true;
          key=snap.val()[a].key;
        }
      }
      localStorage.setItem("key",key)
      if(flag){
        //이미 로그인됨
        this.firemain.child("users").child(key).update({"last_login":new Date()})
        this.navCtrl.setRoot(HomePage,{"id":id})
    }else{
      //최초 로그인
      var ab="false";
      setTimeout(() => {
        ab =this.certificating(id);
      }, 1000);
      
      
    }
    })

    // window.alert(this.id);
    // localStorage.setItem("loginflag", String(this.check));
    // // var user = this.fire.auth.currentUser.email;
    // this.navCtrl.setRoot(HomePage, { "id": this.id });
  }
  certificating(email){

    var userCode = 'imp10391932';
    var data = {
      merchant_uid: 'mid_' + new Date().getTime(),
    };
    var params = {
      userCode: userCode,                           // 가맹점 식별코드
      data: data,                                   // 결제 데이터
      callback: (response)=> {
        console.log(response);
        if(response.imp_success=="true"){


          setTimeout(()=>{
              var a = this.firemain.child("users").push().key;
              this.firemain.child("users").child(a).update({"key":a,"email":email,"first_login":new Date()})
              window.alert("success first login")
          },500)


          return "true";
        }

      },                           // 콜백 함수
    };
    IamportCordova.certification(params);
    return "false"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginpagePage');


    // var id = localStorage.getItem("id");
    // var pass = localStorage.getItem("pass");
    // console.log(id);
    // console.log(pass);
    // if(id=="null"){
    //   id=""
    //   this.id="";
    // }
    // if(id==null||id==undefined){
    //   id=""
    //   this.id="";
    // }
    // var idd = id + "";
    // console.log(idd);
    // if ((id != "null" && pass != "null" &&id!="")) {
    //     this.id = idd;
    //     this.id="";
    //     this.password = pass;
    //     console.log("??");
    //     this.fire.auth.signInWithEmailAndPassword(idd.trim(), pass)
    //         .then( (data) =>{
    //         // localStorage.setItem("gisu", this.id.split("기")[0]);
    //         // localStorage.setItem("name", this.id.split(".")[1].split("@")[0]);
    //         // localStorage.setItem("pass", this.password);
    //         // this.navCtrl.setRoot(MainPage, { "id": this.id });
    //     }).catch( (error)=> {
    //         console.log(error);
    //         alert("login failed" + error);
    //         if (error.code == "auth/user-not-found") {
    //         }
    //         else {
                
    //         }
    //         this.id = "";
    //         this.password = "";
    //     });
    // }else{
    //   console.log("initialize")
    // }
  }
}
