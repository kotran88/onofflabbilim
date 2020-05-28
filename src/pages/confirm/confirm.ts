import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { DeliveryAreaPage } from '../delivery-area/delivery-area';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IamportCordova, PaymentObject } from '@ionic-native/iamport-cordova';
/**
 * Generated class for the ConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var naver;
@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
})
export class ConfirmPage {
  user : any;
  game : any;
  hardware : any;
  peripheral : any;
  totalprice : any;
  gameprice : any;
  contrast : any;

  lat:any;
  lng:any;
  hwArray = [];

  Delivery:any;
  Delivery_check=false;
  resultAddress : any;

  lastchecked : any;
  selected : any;
  count : any;
  newcount : any;
  geo:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.user = this.navParams.get("user");
    this.totalprice = this.navParams.get("price");
    this.game = this.navParams.get("game");
    this.hardware = this.navParams.get("hw");
    this.peripheral = this.navParams.get("peri");
    this.gameprice = this.navParams.get("gameprice");
    this.contrast = this.navParams.get("contrast");

    console.log(this.user);
    console.log(this.totalprice);
    console.log(this.game);
    console.log(this.hardware);
    console.log(this.peripheral);
    console.log(this.gameprice);
    console.log(this.contrast);
      for(var game in this.hardware){
        if(game == 'hd'){
          if(this.hardware[game]!=undefined){
          console.log(this.hardware[game].name);
          this.hwArray.push(this.hardware[game].name);
        }
      }
    }
   
    console.log(this.hwArray);
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

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
  }

  payment(){
    if(this.payment_check()===false){
      return;
    }
    var data = {
      pay_method: 'card',
      merchant_uid: 'mid_' + new Date().getTime(),
      name: '게임/게임기 대여',
      amount: "3000",
      app_scheme: 'ionickcp',
      buyer_email: '',
      buyer_tel: '010-1234-5678',
      buyer_addr: '서울특별시 강남구 삼성동',
      buyer_postcode: '123-456'
    };

    var PaymentObject = {
      userCode: "imp58611631",
      data: data,
      callback: (response) => {
        console.log(response);
        if (response.imp_success == "true") {
          console.log("결제 완료 ")
        }
      },
    }
    // 아임포트 관리자 페이지 가입 후 발급된 가맹점 식별코드를 사용
    IamportCordova.payment(PaymentObject)
      .then((response) => {
        // this.confirmAlert2("success"+'\n'+JSON.stringify(response))
      })
      .catch((err) => {
        // this.confirmAlert2('error : '+err)
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmPage');
  }
  reversegeo(){
    naver.maps.Service.reverseGeocode({
      location: new naver.maps.LatLng(this.lat, this.lng),
  }, (status,response)=> {
      if (status !== naver.maps.Service.Status.OK) {
        console.log("status not ok");
          console.log(status);
      }else{
        console.log("status  ok");
        console.log(status);
      }

      var result = response.result, // 검색 결과의 컨테이너
          items = result.items; // 검색 결과의 배열
          console.log(result);
          console.log(items[0].address);
          var res=items[0].address.split(" ");
          console.log(res.length);
          console.log(res[1]+"시")
          if(res[1].indexOf("전주")||res[1].indexOf("익산")){
           this.payment();
          }else{
            window.alert("현재 전주와 익산지역에서만 서비스 가능합니다!")
            return;
          }
         
        });
  }
  geolocation_update(){
    this.geo.getCurrentPosition().then((resp) => {
      console.log(resp);
      console.log(resp.coords)
      // resp.coords.latitude
      // resp.coords.longitude
      this.lat=resp.coords.latitude;
      this.lng=resp.coords.longitude;
      this.reversegeo();

    }).catch((error) => {

      window.alert("위치정보는 절대로 수집되지 않으며, 서비스 가능 지역인지 파악하기 위함입니다.")
      console.log('Error getting location', error);
    });
  }

  Delivery_area(){
    this.navCtrl.push(DeliveryAreaPage,{'user':this.user,"Delivery":this.Delivery}).then(() => {
      this.navCtrl.getActive().onDidDismiss(data => {
        if(data){
          this.Delivery=data;
          this.resultAddress=this.Delivery.adress;
          this.Delivery_check=true;
        }
      })
    })
  }
  
  view(i) {
    //0번째 선택 , 1번째 선택
    // 0번째 선택되면

    if(this.lastchecked==undefined){
      this.lastchecked=-1;
    }
    this.selected=i;
    if(this.lastchecked==i){
      this.count++;
      //클릭한거 또 클릭함
     
      if(this.count%2==0){
        this.selected=i;

        this.count=0;
        
      }else{
        this.selected=-1;

      }
      //already clicked
    }else{
      //새로운거 클릭함.
      this.count=0;
      this.newcount++;
      if(this.newcount%2==0){
       
        this.selected=1;

      }else{
        this.selected=i;

        this.newcount=0;

      }
    }
    this.lastchecked=i;
    console.log(this.selected+"is selected")
  }

  payment_check():boolean{
    console.log("결제");
    console.log(this.totalprice);
    var ck=true;

    if(this.Delivery_check===false){
      this.confirmAlert2('어디로 밍을 해야할지 몰라요.<br>주소를 입력해주세요.');
      ck=false;
    }
    else if(this.resultAddress.indexOf("전북 전주")==1 || this.resultAddress.indexOf("전북 익산")==1){
      console.log("전주");
      this.confirmAlert2("현재 전주와 익산 지역만 배송이 가능합니다.<br>주소를 확인해주세요.");
      ck=false;
    }
    else ck=true;
    
    return ck;
  }
}
