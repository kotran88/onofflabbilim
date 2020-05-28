import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides, Platform, ViewController } from 'ionic-angular';
import * as $ from 'jquery';

/**
 * Generated class for the DepositPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {

  @ViewChild('consoleSlide') cslides:Slides;

  contrast=0;
  tick:any;
  sale_data:any;
  hardware:any;
  select_num=0;
  view_flag=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public platform:Platform,public view: ViewController) {

    this.sale_data=navParams.get('sale');
    this.hardware=navParams.get('hardware')

    console.log(this.hardware);
    console.log(this.sale_data);

    let backAction = platform.registerBackButtonAction(() => {
      console.log("secondssssssss");
      this.view.dismiss();
      backAction();
    }, 2)
  }

  deposit_change(){
    console.log(this.contrast);

    this.hardware.pricedaily=this.sale_data.deposit[this.hardware.name][this.contrast]
  }

  slideChanged(){

    this.view_flag=false;
    this.select_num = this.cslides.getActiveIndex();
    this.select_num%=2;

    console.log(this.select_num)
    console.log(this.sale_data)

    for(var sd in this.sale_data.ticknumber){
      console.log(this.hardware[this.select_num])
      if(Number(this.hardware[this.select_num].pricenormal)===Number(sd)){
        this.tick=Number(this.sale_data.ticknumber[sd]);
      }
    }
    this.contrast=0;

    this.view_flag=true;
  }

  change_console(n){
    console.log(this.cslides.getActiveIndex())
    if(n>0) this.cslides.slideNext();
    else this.cslides.slidePrev();
    console.log(this.cslides.getActiveIndex())
    // this.slideChanged3();
  }

  cancle(){
      this.view.dismiss();
  }

  save(){

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepositPage');
  }

}
