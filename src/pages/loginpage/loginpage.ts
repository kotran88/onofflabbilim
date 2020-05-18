import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams, ModalController ,Platform} from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import {IamportCordova} from '@ionic-native/iamport-cordova/'
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
import { HomeslidePage } from '../homeslide/homeslide';
import { AccessPage } from '../access/access';
import { HttpClient } from '@angular/common/http';

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
  certified_code='';
  login_flag=false;

  certified_check=false;
  kko_certified_check=false;
  certified_time:any;
  login_check:any;
  phone_check=false;
  admin_phone:any;

  firemain = firebase.database().ref();
  constructor(private http: HttpClient,public platform: Platform,private geolocation: Geolocation,private uniqueDeviceID: UniqueDeviceID,public alertCtrl:AlertController,public fire:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, public modal : ModalController) {
    
    if(localStorage.getItem('loginflag')!='false'&&localStorage.getItem('loginflag')!=null){
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
      this.firemain.child('admin').child('phone').once('value').then((snap)=>{
        this.admin_phone=snap.val();
      })
    }

    console.log(this.login_check)
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

  goback(){
    this.phone_check=false;
    this.login_check=false;

      this.navCtrl.pop();
  }

  str_format(str,num):string{
    str=String(str);

    for(var i= str.length;i<num;i++){
      str="0"+str;
    }

    return str;
  }

  kko_certified(){
    if(this.phone===''){
      this.confirmAlert2('휴대전화 번호를 입력해 주세요.')
      return;
    }
    else if(this.name===''){
      this.confirmAlert2('이름을 입력해 주세요.')
      return;
    }

    if(this.kko_certified_check===false){

      if(this.phone[0]!='0') this.phone="0"+this.phone;
      console.log(this.name);
      console.log(this.phone);

      this.http.get('http://onofflab.co.kr/authpn?rq=kko&pn='+this.phone).subscribe((response) => {
        console.log(response);
      });
    }

    this.certified_number_check();
  }

  certified_number_check(){
    var timer;
    var time=180;

    if(this.kko_certified_check===false){

      var kko_certified_time=new Date()
      kko_certified_time.setTime(time*1000);
      this.certified_time=''+this.str_format(kko_certified_time.getMinutes(),2)+':'+
                              this.str_format(kko_certified_time.getSeconds(),2);
      
      this.kko_certified_check=true;
  
      timer=setInterval(()=>{
        time-=1;
        kko_certified_time.setTime(time*1000);
        this.certified_time=''+this.str_format(kko_certified_time.getMinutes(),2)+':'+
                                this.str_format(kko_certified_time.getSeconds(),2);
        if(time===0||this.kko_certified_check===false){
          clearInterval(timer);
          this.kko_certified_check=false;
        }
        console.log(time);
        console.log(this.certified_time);
        console.log(kko_certified_time);
      },1000)
    }
    else{
      this.firemain.child('users').child(this.phone).once('value').then((snap)=>{
        console.log(snap.val());
        if(String(this.certified_code)===String(snap.val().certified_code)){
          this.confirmAlert2('인증에 성공하였습니다.')
          clearInterval(timer);
          this.kko_certified_check=false;
          this.login();
        }
        else{
          this.confirmAlert2('인증에 실패하였습니다.')
        }
      })
    }
  }

  certified(){
  this.phone="0"+this.phone;

  console.log(this.phone);
  console.log(this.phone.length);
    
    if(this.phone===this.admin_phone){
      this.name="홍길동";
      console.log("")
      this.login();
      this.certified_check=true;
      return;
    }
    else if(this.name==='') this.confirmAlert2('이름을 입력해주세요.');
    else if(this.phone==='') this.confirmAlert2('휴대폰 번호를 입력해주세요.');
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
          console.log('response');
          console.log(response);
          if(response.imp_success==="true"){
            this.login();
          }
          else if(response.imp_success==="false"){
            this.confirmAlert2("휴대전화 인증에 실패하였습니다.")
            this.navCtrl.setRoot(HomePage);
            // setTimeout(() => {
            //   this.platform.exitApp();
            // }, 3000);
          }
        },                           // 콜백 함수
      };
      IamportCordova.certification(params).then((snap)=>{
        console.log('response2');
        console.log(snap);

        this.confirmAlert2("휴대전화 인증에 실패하였습니다.")

        this.navCtrl.setRoot(HomePage);
        // setTimeout(() => {
        //   this.platform.exitApp();
        // }, 3000);
      });
      // this.navCtrl.push(HomeslidePage);
    }
  }

  login(){

    console.log("login come!")
    console.log(this.phone);
    console.log(this.name);
    this.login_flag=false;

    this.firemain.child('users').child(this.phone).once('value').then((snap)=>{
      
      console.log(snap.val());
      if(snap.val().point===undefined||snap.val().point===null){
        this.login_flag=true;
        this.confirmAlert2('가입을 축하합니다~ 코인을 10개 드립니다.');
        this.coin_check('가입축하 기념',10);
        this.firemain.child('users').child(this.phone).update(
          {
            'first_login':new Date(),
            point:"10",
          }
        )
        this.access_modal();
      }
      this.firemain.child('users').child(this.phone).update(
        {
          'name':this.name,
          'phone':this.phone,
          'last_login':new Date(),
        }
      )
    })
    if(!this.login_flag){
      this.navCtrl.setRoot(HomePage,{"phone":this.phone,"name":this.name})
    }
    localStorage.setItem("loginflag","true");
    localStorage.setItem("id",this.phone);
    localStorage.setItem("name",this.name);
 
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
  }

  st_format(text,len):String{
    text=String(text);
    for(var i=text.length;i<len;i++){
      text='0'+text;
    }
    return text;
  }

  today():String{
    var t=new Date();
    var r=
        this.st_format(t.getFullYear(),4)+'-'+this.st_format(t.getMonth()+1,2)+'-'+this.st_format(t.getDate(),2)
        +'|'+
        this.st_format(t.getHours(),2)+':'+this.st_format(t.getMinutes(),2)+':'+this.st_format(t.getSeconds(),2);
    return r;
  }

  coin_check(res,coin){
    var now=this.today();
    this.firemain.child('users').child(this.phone).child('accumulation').child(now.toString())
    .update({reason:res,coin:coin,date:now})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginpagePage');
  }

  access_modal(){
    let modal = this.modal.create(AccessPage,{"id":this.phone,"name":this.name},{cssClass:'access-modal'});
    modal.onDidDismiss(data=>{
      // this.geolocation_update();
      // this.uuid_update();
      // setTimeout(() => {
      //   this.navCtrl.setRoot(HomePage,{"id":this.phone,"name":this.name})  
      // }, 1000);
    });
    modal.present();
  }
}
