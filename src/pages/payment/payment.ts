import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import * as $ from 'jquery'

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

  user: any;
  diff: any;
  hardware: any;
  game = [];
  startDate: any;
  endDate: any;
  contrast: any;
  coins: any;

  totalpaymoney: any;
  discount: any;
  gamediscount: any;
  originpay: any;
  longdiscount: any;

  hwprice: any;
  hwdiscount: any;
  gameprice : any;
  hardwareprice : any;

  tick: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
    this.user = this.navParams.get("user");
    this.diff = this.navParams.get("diff");
    this.hardware = this.navParams.get("hardware");
    this.game = this.navParams.get("game");
    this.startDate = this.navParams.get("start");
    this.endDate = this.navParams.get("end");

    // this.diff = 19;
    // this.diff = 31;

    
    this.coins = this.user.points;
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
    this.gameprice = this.gamediscount*this.diff;
  }
  coin:any;
 

  choice() {
    var a = 0;
    for (var i in this.game) { this.game[i].price; a += this.game[i].price * this.diff }

    if (this.hardware.name == "닌텐도 스위치") {
      console.log(this.contrast);
      this.originpay = (14000 * this.diff + a);
      if (this.contrast == 0) { this.hwprice = 14000; this.coins = this.user.points; }
      if (this.contrast == 120000) { this.hwprice = 9000;  this.coins = this.user.points; }
      if (this.contrast == 240000) { this.hwprice = 7000;  this.coins = this.user.points; }
      if (this.contrast == 360000) { this.hwprice = 5000;  this.coins = this.user.points; }
      
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
    this.hardwareprice = this.hwprice*this.diff;
    console.log(this.totalpaymoney);
    console.log(this.hardwareprice);
    if (this.diff >= 30) {
      this.longdiscount = ((this.hardwareprice) + this.gameprice) * 0.5;
      this.totalpaymoney =this.longdiscount-this.gameprice;
    }
    if (this.diff >= 15 && this.diff < 30) {
      this.longdiscount = ((this.hardwareprice) + this.gameprice) * 0.8;
      this.totalpaymoney =this.longdiscount-this.gameprice;
    }
    if (this.diff < 15) {
      this.totalpaymoney = this.hardwareprice + this.gameprice;
    }
  }
  clickcoin() {
    console.log(this.coins);
    console.log(this.hardwareprice);
    console.log(this.totalpaymoney);
    if (this.coins > 0) {
      this.totalpaymoney = this.totalpaymoney - 100;
      this.coins--;
      console.log(this.totalpaymoney);
      console.log(this.coins);
      // if(this.totalpaymoney-this.gameprice!= this.hardwareprice){
      //   this.coins = this.user.points
      //   console.log(this.coins);
      // }
    }
    else if(this.coins == 0){
      this.totalpaymoney = this.totalpaymoney;
    }
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


}
