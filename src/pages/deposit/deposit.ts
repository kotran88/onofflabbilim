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
  select_hardware:any;
  select_num=1;
  select_flag=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public platform:Platform,public view: ViewController) {

    this.sale_data=navParams.get('sale');
    this.hardware=navParams.get('hardware')
    this.select_hardware=undefined;

    console.log(this.hardware);
    console.log(this.sale_data);
    console.log(this.select_hardware)

    let backAction = platform.registerBackButtonAction(() => {
      console.log("secondssssssss");
      this.view.dismiss({hd:undefined});
      backAction();
    }, 2)
  }

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
  }

  deposit_change(){
    console.log(this.contrast);

    var num=0;
    if(this.contrast<this.select_hardware.pricenormal/4) num=0;
    else if(this.contrast<this.select_hardware.pricenormal/2) num=1;
    else if(this.contrast>this.select_hardware.pricenormal/4*3) num=3;
    else num=2;

    this.select_hardware.pricedaily=this.sale_data.deposit[this.select_hardware.name][num]
    console.log(this.select_hardware);
  }

  slideChanged(){
    this.select_flag=false;
    this.select_hardware=undefined;
    this.select_num = this.cslides.getActiveIndex();
    this.select_num%=2;
    // this.select_num=1-this.select_num

    console.log(this.select_num)
    if(this.select_num % 2 == 0){
      $(".slidenintendo").css("color","#70c5ed");
      $(".slidelight").css("color","#d3d3d3");
    }else if(this.select_num % 2 == 1){
      $(".slidelight").css("color","#70c5ed");
      $(".slidenintendo").css("color","#d3d3d3");
    }
    console.log(this.sale_data)

    for(var sd in this.sale_data.ticknumber){
      console.log(sd)
      console.log(this.hardware[this.select_num])
      if(Number(this.hardware[this.select_num].pricenormal)===Number(sd)){
        this.tick=Number(this.sale_data.ticknumber[sd]);
        this.select_hardware=this.hardware[this.select_num];
        break;
      }
    }
  }

  change_console(n){
    console.log(this.cslides.getActiveIndex())
    if(n>0) this.cslides.slideNext();
    else this.cslides.slidePrev();
    console.log(this.cslides.getActiveIndex())
    // this.slideChanged3();
  }

  select(){
    this.contrast=0;
    this.select_hardware=this.hardware[this.select_num];
    this.deposit_change();
    this.select_flag=true;
  }

  cancle(){
    this.view.dismiss({hd:undefined});
  }

  save(){
    if(this.select_flag===true){
      console.log(this.select_hardware.pricedaily);
      console.log(this.contrast);
      this.view.dismiss({hd:this.select_hardware,ct:this.contrast});
    }
    else{
      alert('보증금을 선택해 주세요.')
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepositPage');
  }
}
