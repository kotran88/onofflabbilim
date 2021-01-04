import { Component } from '@angular/core';
import * as firebase from "firebase";
import * as $ from 'jquery';

import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

/**
 * Generated class for the DiscountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-discount',
  templateUrl: 'discount.html',
})
export class DiscountPage {
  user: any;
  userId: any;
  mycoin: any;
  coin: any;
  totalcoin: any;
  price : any;
  currentcoin : any;
  count = 0;
  coinprice:any;
  firemain = firebase.database().ref();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public view: ViewController) {
    this.user=this.navParams.get('user');
    this.coinprice=this.navParams.get('sale');
    this.price=this.navParams.get('price');
    console.log(this.user);
    this.coin = Number(this.user.point);
    this.currentcoin = this.coin;
    this.firemain.child('users').child(this.user.phone).once('value').then((snap)=>{
      this.totalcoin=snap.val().point;
    })
    console.log(this.price);
  }

  str_format(text,len):String{
    text=String(text);
    for(var i=text.length;i<len;i++){
      text='0'+text;
    }
    return text;
  }
  today():String{
    var t=new Date();
    var r=
        this.str_format(t.getFullYear(),4)+'-'+this.str_format(t.getMonth()+1,2)+'-'+this.str_format(t.getDate(),2)
        +'|'+
        this.str_format(t.getHours(),2)+':'+this.str_format(t.getMinutes(),2)+':'+this.str_format(t.getSeconds(),2);
    return r;
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

  clickcoin(n) {
    this.price-=n*this.coinprice;
    if(this.price<=0){
      this.confirmAlert2('0원 이하는 될수 없습니다.');
      this.price+=n*this.coinprice;
    }
    else{
      this.count+=n;
      console.log(this.count);
      this.currentcoin-=n;
      console.log(this.price);
      console.log(this.currentcoin);
    }
  }

  goup(){
    console.log("goup")
    console.log(this.currentcoin);

    if(this.currentcoin>=this.totalcoin){
      this.confirmAlert2('보유코인을 초과 할 수 없습니다.')
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

  godown(){
    console.log("godown")
    console.log(this.currentcoin);

    if(this.currentcoin<=0){
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

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
  }

  apply(){
    console.log('apply');
    console.log(this.currentcoin);
    var now=this.today();
    // this.firemain.child('users').child(this.user.phone).child('accumulation').child(now.toString()).update({reason:"밍 포인트 사용",coin:-Number(this.totalcoin-this.currentcoin),date:now});
    // this.firemain.child('users').child(this.user.phone).update({point:Number(this.currentcoin)})
    this.view.dismiss({coin:this.currentcoin,coinprice:Number(this.totalcoin-this.currentcoin)*this.coinprice});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscountPage');
  }

}
