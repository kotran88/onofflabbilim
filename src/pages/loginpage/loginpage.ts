import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams, ModalController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import  firebase from 'firebase';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import {IamportCordova} from '@ionic-native/iamport-cordova/'
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
import { HomeslidePage } from '../homeslide/homeslide';
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
  test_phone:any;

  firemain = firebase.database().ref();
  constructor(private geolocation: Geolocation,private uniqueDeviceID: UniqueDeviceID,public alertCtrl:AlertController,public fire:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, public modal : ModalController) {
    
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
        this.test_phone=snap.val();
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

  certified(){

    if(this.phone===this.test_phone){
      this.name="홍길동";
      this.login();
      this.certified_check=true;
      return;
    }

    if(this.name==='') this.confirmAlert2('이름을 입력해주세요.');
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
          
          if(response.imp_success){
            this.confirmAlert2("휴대전화 인증이 완료되었습니다");
            this.login();
            let modal = this.modal.create(HomeslidePage,{},{ cssClass: 'test-modal' });
            modal.present();
            return;

          }
        },                           // 콜백 함수
      };
      IamportCordova.certification(params);
     
      // this.navCtrl.push(HomeslidePage);
    }
  }

  login(){
    this.uniqueDeviceID.get()
    .then((uuid: any) =>{
      console.log('a');
      console.log(uuid)
      // this.unique_ID=uuid; 
      this.firemain.child('users').child(this.phone).update({'uuid':uuid}).then(()=>{
        console.log('uuid then')
      })
    })
    .catch((error: any) => console.log(error));

    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('b');
      console.log(resp);
      console.log(resp.coords)
      // resp.coords.latitude
      // resp.coords.longitude
      this.firemain.child('users').child(this.phone).child('geolocation').push({
        ratitude:resp.coords.latitude,
        longitude:resp.coords.longitude,
        date:new Date(),
      }).then(()=>{
        console.log('resp then')
      })
    }).catch((error) => {
      console.log('Error getting location', error);
    });

     this.firemain.child('users').child(this.phone).once('value').then((snap)=>{
      this.firemain.child('users').child(this.phone).update(
        {
          'name':this.name,
          'phone':this.phone,
          'last_login':new Date(),
        }
      )
      if(snap.val()===undefined||snap.val()===null){
        this.confirmAlert2('가입을 축하합니다. 밍을 부담없이 하기 위해 코인을 1개 드립니다.');
        this.firemain.child('users').child(this.phone).update(
          {
            'first_login':new Date(),
            point:"1",
          }
        )
      }
    })
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
