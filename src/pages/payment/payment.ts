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
  hardwareprice: any;
  contrast : any;
  coins: any;

  totalpaymoney: any;
  discount: any;
  gamediscount: any;
  originpay: any;
  longdiscount: any;

  hwprice: any;

  tick: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
    this.user = this.navParams.get("user");
    this.diff = this.navParams.get("diff");
    this.hardware = this.navParams.get("hardware");
    this.game = this.navParams.get("game");
    this.startDate = this.navParams.get("start");
    this.endDate = this.navParams.get("end");

    // this.diff = 19;
    if (this.hardware != undefined) {
      this.hardwareprice = this.hardware.pricedaily * this.diff
    }
    this.coins = this.user.points;
    console.log(this.user);
    console.log(this.diff);
    console.log(this.hardware);
    console.log(this.game);
    console.log(this.startDate);
    console.log(this.endDate);
    console.log(this.hardwareprice);
    console.log(this.hardware.pricenormal);

    var ticknumber = 0;

    ticknumber = Math.ceil(this.hardware.pricenormal * 0.33);
    console.log(ticknumber);
    if (ticknumber == 118800) { this.tick = 120000 }
    if (ticknumber == 79200) { this.tick = 80000 }
    if (ticknumber == 141900) { this.tick = 160000 }

    console.log(this.tick)
    this.rangeSlider();
    var a = 0;
    var gamedct = 0;
    for (var i = 0; i < this.game.length; i++) {
      a += this.game[i].price * this.diff;
      this.originpay = a + b;
      if (this.hardware != undefined) {
        gamedct += this.game[i].price * 0.5;
      }
      console.log("gamedct :" + gamedct);
    }
    this.gamediscount = gamedct;
    var b = 0;
    if (this.hardware != undefined) {
      b = this.hardware.pricedaily * this.diff;
      // this.totalpaymoney = (gamedct*this.diff)+b;
      this.originpay = a + b;
      if (this.diff >= 30) {
        this.totalpaymoney = ((gamedct * this.diff) + b) * 0.5;
        this.discount = this.originpay - this.totalpaymoney - (this.gamediscount * this.diff);
      }
      if (this.diff >= 15 && this.diff < 30) {
        this.totalpaymoney = ((gamedct * this.diff) + b) * 0.8
        this.discount = this.originpay - this.totalpaymoney - this.gamediscount;
      }
      if (this.diff < 15) {
        this.totalpaymoney = (gamedct * this.diff) + b;
        this.discount = 0;
      }
    }
    if (this.hardware == undefined) {
      // this.totalpaymoney = a+b;
      this.originpay = a + b;
      if (this.diff >= 30) {
        this.totalpaymoney = (a + b) * 0.5
        this.discount = this.originpay - this.totalpaymoney - this.gamediscount;
      }
      if (this.diff >= 15 && this.diff < 30) {
        this.totalpaymoney = (a + b) * 0.8
        this.discount = this.originpay - this.totalpaymoney - this.gamediscount;
      }
      if (this.diff < 15) {
        this.totalpaymoney = a + b;
        this.discount = 0;
      }
    }
    console.log("game total : " + a);
    console.log("game total : " + gamedct);

    console.log("hardware total :" + b);

  }

  clickcoin() {
    console.log(this.coins);
  }

  choice() {
    if (this.hardware.name == "닌텐도 스위치") {
      console.log(this.contrast);
      if (this.contrast == undefined) { this.hwprice = 14000; }
      if (this.contrast == 0) { this.hwprice = 14000; }
      if (this.contrast == 120000) { this.hwprice = 9000; }
      if (this.contrast == 240000) { this.hwprice = 7000; }
      if (this.contrast == 360000) { this.hwprice = 5000; }
    }
    if (this.hardware.name == "스위치 라이트") {
      if (this.contrast == undefined) { this.hwprice = 10000; }
      if (this.contrast == 0) { this.hwprice = 10000 }
      if (this.contrast == 80000) { this.hwprice = 6000 }
      if (this.contrast == 160000) { this.hwprice = 4000 }
      if (this.contrast == 240000) { this.hwprice = 3000 }
    }
    if (this.hardware.name == "Playstation Pro") {
      if (this.contrast == undefined) { this.hwprice = 19000; }
      if (this.contrast == 0) { this.hwprice = 19000 }
      if (this.contrast == 160000) { this.hwprice = 12000 }
      if (this.contrast == 320000) { this.hwprice = 9000 }
      if (this.contrast == 430000) { this.hwprice = 7000 }
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
