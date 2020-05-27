import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
  constructor(public geo:Geolocation,public navCtrl: NavController, public navParams: NavParams) {
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
        console.log(this.hardware[game].name);
        this.hwArray.push(this.hardware[game].name);
      }
    }
    console.log(this.hwArray);
  }

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
  }

  payment(){
    
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
          // console.log(this.hardware);
          // console.log(this.coins);
          // console.log("coin is")
          // var now = new Date();

          // var tomorrow = new Date();
          // tomorrow.setDate(now.getDate()+1);
          // var year = now.getFullYear();
          // var month = now.getMonth() + 1;
          // var date = now.getDate();
          // var hour = now.getHours();
          // var min = now.getMinutes();
          // var nnow = year + "-" + month + "-" + date + " " + hour + ":" + min;

          // if (this.hardware != undefined) {
          //   var k = this.firemain.child("users").child(this.user.phone).child("orderlist").push().key;
          //   this.firemain.child("users").child(this.user.phone).child("orderlist").child(k).update({ "phone": this.user.phone, "key": k, "status": "paid", "startDate": this.startDate_text, "endDate": this.endDate_text, "diff": this.diff, "orderdate": nnow, "game": this.game, "hardware": this.hardware, "totalprice": this.totalpaymoney, "payment": this.totalpaymoney }).then(() => {
          //     var delivery_time:any;
          //     if(hour<9) delivery_time="배송예정시각은 오늘("+now.getDate()+") 오전 9시~11시 입니다.";
          //     else if(hour>=9&&hour<13){delivery_time="배송예정시각은 오늘("+now.getDate()+") 오후 3시~5시 입니다.";}else{
          //       delivery_time="배송예정시각은 내일("+tomorrow.getDate()+")일 오전 9시~ 11시 입니다"
          //     }
          //     this.confirmAlert2("<p>주문이 완료되었습니다.</p><p>마이 페이지에서 상세내역 확인이 가능합니다.</p>"+delivery_time);
          //     this.coin_check();
          //     this.game_stock_check();
          //     this.send_push('주문이 들어왔습니다.',this.user.name+'님이 주문을 하셨습니다.','');
          //     setTimeout(() => {
          //       this.navCtrl.setRoot(HomePage);
          //     }, 1000);
          //   }).catch((e) => {
          //     console.log(e);
          //   })

          // } 
          // else {

          //   var k = this.firemain.child("users").child(this.user.phone).child("orderlist").push().key;
          //   this.firemain.child("users").child(this.user.phone).child("orderlist").child(k).update({ "phone": this.user.phone, "key": k, "status": "paid", "startDate": this.startDate_text, "endDate": this.endDate_text, "diff": this.diff, "orderdate": nnow, "game": this.game, "totalprice": this.totalpaymoney, "payment": this.totalpaymoney }).then(() => {
          //     var delivery_time:any;
          //     if(hour<9) delivery_time="배송예정시각은 오늘("+now.getDate()+") 오전 9시~11시 입니다.";
          //     else if(hour>=9&&hour<13){delivery_time="배송예정시각은 오늘("+now.getDate()+") 오후 3시~5시 입니다.";}else{
          //       delivery_time="배송예정시각은 내일("+tomorrow.getDate()+")일 오전 9시~ 11시 입니다"
          //     }
          //     this.confirmAlert2("<p>주문이 완료되었습니다.</p><p>마이 페이지에서 상세내역 확인이 가능합니다.</p>"+delivery_time);
          //     this.coin_check();
          //     this.game_stock_check();
          //     this.send_push('주문이 들어왔습니다.',this.user.name+'님이 주문을 하셨습니다.','');
          //     setTimeout(() => {
          //       this.navCtrl.setRoot(HomePage);
          //     }, 1000);
          //   }).catch((e) => {
          //     console.log(e);
          //   })
          // }
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

}
