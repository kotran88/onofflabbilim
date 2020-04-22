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

  sale_data:any;
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

  console_sale_gameprice:any;

  tick: any;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
    this.user = this.navParams.get("user");
    this.diff = this.navParams.get("diff");
    this.hardware = this.navParams.get("hardware");
    this.game = this.navParams.get("game");
    this.startDate = this.navParams.get("start");
    this.endDate = this.navParams.get("end");
    this.sale_data=this.navParams.get("sale");
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
      for(var sd in this.sale_data.ticknumber){
        if(ticknumber===Number(sd)){
          this.tick=this.sale_data.ticknumber[sd];
        }
      }
    }

    this.rangeSlider();
    var a = 0;
    var gamedct = 0;
    this.console_sale_gameprice=0;
    for (var i = 0; i < this.game.length; i++) {
      a += this.game[i].price * this.diff;
      // this.originpay = a + b;
      if (this.hardware != undefined) {
        gamedct += this.game[i].price * ((100-Number(this.sale_data.percentage.console.split('%')[0]))/100);
        this.console_sale_gameprice+=Number(this.game[i].price * Number(this.sale_data.percentage.console.split('%')[0])/100);
      }
      else if (this.hardware == undefined) {
        gamedct += this.game[i].price * 1;
      }
    }
    this.console_sale_gameprice*=this.diff;
    console.log(this.console_sale_gameprice)
    this.gamediscount = gamedct;
    this.gameprice = this.gamediscount * this.diff;
    console.log(this.gamediscount);
    console.log(this.gameprice);
    console.log(this.sale_data)
    this.choice();
  }
  coin: any;

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
  }
  
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
      for(var sd in this.sale_data.deposit){
        if(this.hardware.name===sd){
          this.originpay=Number(this.sale_data.deposit[sd]['0']) * this.diff + a;
          for(var sd2 in this.sale_data.deposit[sd]){
            if(this.contrast==Number(sd2)){
              this.hwprice = Number(this.sale_data.deposit[sd][sd2]);
              this.coins = this.user.points;
            }
          }
        }
      }
      this.hardwareprice = this.hwprice * this.diff;
      console.log(this.hardwareprice);
      console.log(this.sale_data)
      console.log(this.longdiscount)
      
      this.totalpaymoney = this.hardwareprice + this.gameprice;
      for(var sd in this.sale_data.percentage.date){
        if(this.diff>=Number(sd.split('~')[0])&&(Number(sd.split('~')[1])===0||this.diff<Number(sd.split('~')[1]))){
          this.longdiscount = 
          this.totalpaymoney-(this.totalpaymoney * 
          ((100-Number(this.sale_data.percentage.date[sd].split('%')[0]))/100));
          
          break;
        }
      }
      console.log(this.longdiscount)
    }
    if (this.hardware == undefined) {
      this.originpay = this.gameprice;
      this.totalpaymoney=this.gameprice;

      for(var sd in this.sale_data.percentage.date){
        if(this.diff>=Number(sd.split('~')[0])&&(Number(sd.split('~')[1])===0||this.diff<Number(sd.split('~')[1]))){
          this.longdiscount =
          this.totalpaymoney-(this.gameprice * 
          ((100-Number(this.sale_data.percentage.date[sd].split('%')[0]))/100));
          break;
        }
      }
    }

    this.totalpaymoney-=this.longdiscount;
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
    console.log(this.totalpaymoney);
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