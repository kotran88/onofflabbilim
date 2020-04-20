import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ViewController } from 'ionic-angular';
import * as $ from 'jquery'
import firebase from 'firebase';
import { IamportCordova, PaymentObject } from '@ionic-native/iamport-cordova';
import { HomePage } from '../home/home';
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  firemain = firebase.database().ref();
  user: any;
  diff: any;
  hardware: any;
  game = [];
  startDate: any;
  endDate: any;
  contrast: number = 0;
  coins: any;
  totalcoins;
  count = 0;

  totalpaymoney: any;
  discount: any;
  gamediscount: any;
  originpay: any;
  longdiscount: any;

  hwprice: any;
  hwdiscount: any;
  gameprice: any;
  gameprice_piece:any;
  hardwareprice: any;
  coindiscount: any;

  tick: any;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
    this.user = this.navParams.get("user");
    this.diff = this.navParams.get("diff");
    this.hardware = this.navParams.get("hardware");
    this.game = this.navParams.get("game");
    this.startDate = this.navParams.get("start");
    this.endDate = this.navParams.get("end");
    console.log(this.contrast);
    // this.diff = 19;
    // this.diff = 31;

    this.coins = this.user.points;
    this.totalcoins=this.coins;
    console.log(this.user);
    console.log(this.diff);
    console.log(this.hardware);
    console.log(this.game);
    console.log(this.startDate);
    console.log(this.endDate);
    // console.log(this.hardware.pricenormal);
    if (this.hardware != undefined) {
      var ticknumber = 0;
      ticknumber = Math.ceil(this.hardware.pricenormal * 0.33);
      console.log(ticknumber);
      if (ticknumber == 118800) { this.tick = 120000 }
      if (ticknumber == 79200) { this.tick = 80000 }
      if (ticknumber == 141900) { this.tick = 160000 }
    }

    this.rangeSlider();
    var a = 0;
    var gamedct = 0;
    for (var i = 0; i < this.game.length; i++) {
      a += this.game[i].price * this.diff;
      // this.originpay = a + b;
      if (this.hardware != undefined) {
        gamedct += this.game[i].price * 0.5;
      }
      else if (this.hardware == undefined) {
        gamedct = this.game[i].price
      }
    }
    this.gamediscount = gamedct;
    this.gameprice = this.gamediscount * this.diff;
    this.choice();
  }
  coin: any;

  ordering() {

    var data = {
      pay_method: 'card',
      merchant_uid: 'mid_' + new Date().getTime(),
      name: 'Ming 코인충전',
      amount: this.totalpaymoney + "",
      app_scheme: 'ionickcp',
      buyer_email: 'iamport@siot.do',
      buyer_name: '구매자이름',
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
          console.log("success")
          console.log(this.hardware);
          console.log(this.coins);
          console.log("coin is")
          var now = new Date();
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var date = now.getDate();
          var hour = now.getHours();
          var min = now.getMinutes();
          var nnow = year + "-" + month + "-" + date + " " + hour + ":" + min;
          console.log(nnow);
          if (this.hardware != undefined) {
            var k = this.firemain.child("users").child(this.user.phone).child("orderlist").push().key;
            this.firemain.child("users").child(this.user.phone).child("orderlist").child(k).update({ "phone": this.user.phone, "key": k, "status": "paid", "startDate": this.startDate, "endDate": this.endDate, "diff": this.diff, "orderdate": nnow, "game": this.game, "hardware": this.hardware, "totalprice": this.totalpaymoney, "payment": this.totalpaymoney }).then(() => {
              this.confirmAlert2("<p>주문이 완료되었습니다.</p><p>마이 페이지에서 상세내역 확인이 가능합니다.</p>");
              this.firemain.child("users").child(this.user.phone).update({ "points": this.coins })
              this.navCtrl.setRoot(HomePage);
            }).catch((e) => {
              console.log(e);
            })

          } else {

            var k = this.firemain.child("users").child(this.user.phone).child("orderlist").push().key;
            this.firemain.child("users").child(this.user.phone).child("orderlist").child(k).update({ "phone": this.user.phone, "key": k, "status": "paid", "startDate": this.startDate, "endDate": this.endDate, "diff": this.diff, "orderdate": nnow, "game": this.game, "totalprice": this.totalpaymoney, "payment": this.totalpaymoney }).then(() => {
              this.confirmAlert2("<p>주문이 완료되었습니다.</p><p>마이 페이지에서 상세내역 확인이 가능합니다.</p>");
              this.firemain.child("users").child(this.user.phone).update({ "points": this.coins })
              this.navCtrl.setRoot(HomePage);
            }).catch((e) => {
              console.log(e);
            })
          }
        }
      },
    }


    // 아임포트 관리자 페이지 가입 후 발급된 가맹점 식별코드를 사용
    IamportCordova.payment(PaymentObject)
      .then((response) => {
        this.confirmAlert2("success"+'\n'+JSON.stringify(response))
      })
      .catch((err) => {
        this.confirmAlert2('error : '+err)
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
    alert.present({ animate: false });
  }
  choice() {
    var a = 0;
    for (var i in this.game) { this.game[i].price; a += this.game[i].price * this.diff }
    if (this.hardware != undefined) {
      if (this.hardware.name == "닌텐도 스위치") {
        console.log(this.contrast);
        this.originpay = (14000 * this.diff + a);
        if (this.contrast == 0) { this.hwprice = 14000; this.coins = this.user.points; }
        if (this.contrast == 120000) { this.hwprice = 9000; this.coins = this.user.points; }
        if (this.contrast == 240000) { this.hwprice = 7000; this.coins = this.user.points; }
        if (this.contrast == 360000) { this.hwprice = 5000; this.coins = this.user.points; }
      }
      if (this.hardware.name == "스위치 라이트") {
        this.originpay = (10000 * this.diff + a);
        if (this.contrast == 0) { this.hwprice = 10000; this.coins = this.user.points; }
        if (this.contrast == 80000) { this.hwprice = 6000; this.coins = this.user.points; }
        if (this.contrast == 160000) { this.hwprice = 4000; this.coins = this.user.points; }
        if (this.contrast == 240000) { this.hwprice = 3000; this.coins = this.user.points; }
      }
      if (this.hardware.name == "Playstation Pro") {
        this.originpay = (19000 * this.diff + a);
        if (this.contrast == 0) { this.hwprice = 19000; this.coins = this.user.points; }
        if (this.contrast == 160000) { this.hwprice = 12000; this.coins = this.user.points; }
        if (this.contrast == 320000) { this.hwprice = 9000; this.coins = this.user.points; }
        if (this.contrast == 430000) { this.hwprice = 7000; this.coins = this.user.points; }
      }
      this.hardwareprice = this.hwprice * this.diff;
      console.log(this.hardwareprice);
      if (this.diff >= 30) {
        this.longdiscount = ((this.hardwareprice) + this.gameprice) * 0.6;
        this.totalpaymoney = this.longdiscount - this.gameprice;
      }
      if (this.diff >= 15 && this.diff < 30) {
        this.longdiscount = ((this.hardwareprice) + this.gameprice) * 0.8;
        this.totalpaymoney = this.longdiscount - this.gameprice;
      }
      if (this.diff < 15) {
        this.totalpaymoney = this.hardwareprice + this.gameprice;
      }
    }
    if (this.hardware == undefined) {
      this.originpay = this.gameprice;

      if (this.diff >= 30) {
        this.totalpaymoney = this.gameprice * 0.6;
        this.longdiscount = this.totalpaymoney;
      }
      if (this.diff >= 15 && this.diff < 30) {
        this.totalpaymoney = this.gameprice * 0.8;
        console.log(this.totalpaymoney);
        this.longdiscount = this.totalpaymoney;

      }
      if (this.diff < 15) {
        this.totalpaymoney = this.gameprice;
      }
    }
    this.gameprice_piece=this.gameprice/this.game.length
  }
  
  clickcoin(n) {
    console.log(this.coins);
    console.log(this.totalpaymoney);
    // this.count+=n;
    console.log(this.count);

    this.count+=n;
    this.coins-=n;

    this.coindiscount=this.count * 100;
    this.totalpaymoney-=n*100;

    // if (this.coins > 0) {
    //   // this.totalpaymoney = this.totalpaymoney - 100;
    //   this.coins--;
    //   console.log(this.totalpaymoney);
    //   console.log(this.coins);
    //   this.coindiscount = this.count * 100;
    // }
    // else if (this.coins == 0) {
    //   this.totalpaymoney = this.totalpaymoney;
    // }
  }

  rangeSlider = function () {
    console.log("slide");
    var slider = $('.range-slider'),
      range = $('.range-slider__range'),
      value = $('.range-slider__value');
    console.log(slider);
    console.log(range);
    console.log(value);
    slider.each(function () {

      value.each(function () {
        var value = $(this).prev().attr('value');
        $(this).html(value);
        console.log(value);
      });

      range.on('input', function () {
        $(this).next(value).html(this.value);
        console.log(range);
      });
    });
  };

  goback() {
    this.view.dismiss();
  }

  godown(){
    console.log("godown")
    console.log(this.coins);

    if(this.coins<=0){
      this.confirmAlert2('코인이 부족합니다.');
    }
    else{
      // this.coins-=1;
      this.clickcoin(1);
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
    console.log("goup")
    console.log(this.coins);
  
    if(this.coins>=this.totalcoins){
      this.confirmAlert2('보유코인을 초과 할 수 없습니다..')
    }
    else{
      this.clickcoin(-1);
      // this.coins=this.coins+1;
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
}
