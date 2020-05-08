import { Component } from '@angular/core';
import { IonicPage,Platform,AlertController, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase/app';
import * as $ from 'jquery'
import { IamportCordova ,PaymentObject} from '@ionic-native/iamport-cordova';
/**
 * Generated class for the CoinsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-coins',
  templateUrl: 'coins.html',
})
export class CoinsPage {
  mycoin:any;
  mycoins:any=0;
  user:any;
  id:any;
  
  firemain = firebase.database().ref();
  constructor(public platform:Platform,public alertCtrl:AlertController,public navCtrl: NavController, public navParams: NavParams) {
    this.id=this.navParams.get("id");
    this.user=this.navParams.get("user");
    console.log(this.id);
    console.log(this.user);
    this.mycoin=this.user.points;
    let backAction =  platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    },2)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoinsPage');
  }
  goback(){
    this.navCtrl.pop();
  }
  charge(coin,value){
console.log(coin+","+value);
var totalcoin=0;
totalcoin=this.mycoin+coin;
    this.confirmAlert2(totalcoin);
    var data = {
      pay_method : 'card',
      merchant_uid: 'mid_' + new Date().getTime(),
      name : 'Ming 코인충전',
      amount : value,
      app_scheme : 'ionickcp',
      buyer_email : 'iamport@siot.do',
      buyer_name : '구매자이름',
      buyer_tel : '010-1234-5678',
      buyer_addr : '서울특별시 강남구 삼성동',
      buyer_postcode : '123-456'
    };


    var PaymentObject={
      userCode: "imp58611631",
      data: data,
      callback:(response)=> {
        console.log(response);
        if(response.imp_success=="true"){
          console.log("success")
          var now=new Date();
          var year=now.getFullYear();
          var month=now.getMonth()+1;
          var date=now.getDate();
          var hour=now.getHours();
          var min=now.getMinutes();
          var nnow=year+"-"+month+"-"+date+" "+hour+":"+min;
          console.log(nnow);
          this.firemain.child("users").child(this.user.phone).child("charge").push({"chargedate":nnow,"chargecoin":coin,"nowcoin":totalcoin})
          this.firemain.child("users").child(this.user.phone).update({"points":totalcoin})
          this.confirmAlert2(coin+"개의 코인 충전이 완료되었습니다")
        }
      },   
    }
        
    
    // 아임포트 관리자 페이지 가입 후 발급된 가맹점 식별코드를 사용
    IamportCordova.payment(PaymentObject )
      .then((response)=> {
        // alert("success")
        this.confirmAlert2("success"+'\n'+JSON.stringify(response));
        // this.confirmAlert2(JSON.stringify(response))
      })
      .catch((err)=> {
        this.confirmAlert2('error : '+err+'관리자에게 문의하세요.');
      })
    ;
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

  godown(){
    console.log("ccccclicked")
    console.log(this.mycoins);

    this.mycoins=this.mycoins-1;
    if(this.mycoins<0){
      this.mycoins=0;
      return;
    }
    else{
      setTimeout(() => {
        $('#abc').animate({
          bottom: '+=10'
        }, 100,
          function(){
            console.log('done')
            $('#abc').animate({
              bottom: '-=10'
            }, 100,function(){
              console.log('done')
            })
          }
        )
      },10);

    }


  
  }
  
  goup(){
    console.log("clicked")
    console.log(this.mycoins);
  
    this.mycoins=this.mycoins+1;
    // this.discount+=1000
    // this.pricetopay=this.totalprice-this.discount;
    setTimeout(() => {
      $('#abc').animate({
        bottom: '+=10'
      }, 100,
        function(){
          console.log('done')
          $('#abc').animate({
            bottom: '-=10'
          }, 100,function(){
            console.log('done')
          })
        }
      )
    },10);
  }
}
