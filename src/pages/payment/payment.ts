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

  user : any;
  diff : any;
  hardware : any;
  game = [];
  startDate : any;
  endDate : any;
  hardwareprice :any;
  contrast : any;
  coins : any;
  paymoney : any;
  gamepaysum : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
    this.user = this.navParams.get("user");
    this.diff = this.navParams.get("diff");
    this.hardware = this.navParams.get("hardware");
    this.game = this.navParams.get("game");
    this.startDate = this.navParams.get("start");
    this.endDate = this.navParams.get("end");
    this.hardwareprice = this.hardware.pricedaily*this.diff
    this.coins=this.user.points;
    console.log(this.user);
    console.log(this.diff);
    console.log(this.hardware);
    console.log(this.game);
    console.log(this.startDate);
    console.log(this.endDate);
    console.log(this.hardwareprice);

    this.rangeSlider();
    for(var i in this.game){
      console.log(this.game[i].price);
      this.gamepaysum =+this.game[i].price;
    }
    console.log(this.gamepaysum);

  }
  clickcoin(){
   console.log(this.coins);
  }

  choice(){
    console.log(this.contrast);
  }

  rangeSlider = function(){
    console.log("slide");
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');
      console.log(slider);
      console.log(range);
      console.log(value);
    slider.each(function(){
  
      value.each(function(){
        var value = $(this).prev().attr('value');
        $(this).html(value);
      });
  
      range.on('input', function(){
        $(this).next(value).html(this.value);
      });
    });
    console.log(this.contrast);

  };
  
  goback() {
    this.view.dismiss();
  }


}
