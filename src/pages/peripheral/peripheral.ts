import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, Slides } from 'ionic-angular';
import * as $ from 'jquery';

/**
 * Generated class for the PeripheralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-peripheral',
  templateUrl: 'peripheral.html',
})
export class PeripheralPage {

  @ViewChild('peripheralSlide') pslides:Slides;

  peripheral:any;
  select_peri:any;
  peri_slide:any;

  constructor(public zone:NgZone, public navCtrl: NavController, public navParams: NavParams,public platform:Platform,public view: ViewController) {
    
    this.peripheral=navParams.get('peripheral');
    this.push_slide();
    this.select_peri=undefined;

    for(var i in this.peripheral){
      this.peripheral[i].fflag=false;
    }

    console.log(this.peripheral);
    
    let backAction = platform.registerBackButtonAction(() => {
      console.log("secondssssssss");
      this.view.dismiss({pp:undefined});
      backAction();
    }, 2)
  }

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PeripheralPage');
  }

  push_slide(){
    this.zone.run(()=>{
      this.peri_slide=[];
      var num=this.peripheral.length;
      var lmt=Math.floor(num/6)*6+(num%6);
      console.log(this.peripheral);
      console.log(num)
      console.log(lmt)
  
      for(var i=0;i<lmt/2;i++){
        this.peri_slide[i]=[];
        // for(var j=0;j<6;j+=2){
          if(num<=(i*2)) break;
          this.peri_slide[i][0]=this.peripheral[(i*2)];
          this.peri_slide[i][0].num=(i*2);
  
          if(num<=(i*2)+1) break;
          this.peri_slide[i][1]=this.peripheral[(i*2)+1];
          this.peri_slide[i][1].num=(i*2)+1;
        // }
      }
      console.log(this.peri_slide)
    })
  }

  periselected(v,i){ 
    this.zone.run(()=>{
      var count=0;
      console.log(this.peripheral[i]);
      console.log(this.peripheral[i].fflag)
      if(Number(this.peripheral[i].stock)<=0){
        alert('재고가 없는 기기입니다.');
      }
      else{
        count=0;
        this.select_peri=[];
        
        this.peripheral[i].fflag=!this.peripheral[i].fflag;
        for(var j=0; j<this.peripheral.length; j++){
          if(this.peripheral[j].fflag==true){
            this.select_peri[count]=this.peripheral[j];
            count++;
          }
        }
        console.log("count is : "+count);
        console.log(this.select_peri)
        console.log(this.peri_slide);
      }
    })
  }

  cancle(){
    this.view.dismiss({pp:undefined});
  }

  save(){
      this.view.dismiss({pp:this.select_peri});
  }
}
