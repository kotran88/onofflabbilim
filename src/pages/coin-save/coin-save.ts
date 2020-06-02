import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';

/**
 * Generated class for the CoinSavePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-coin-save',
  templateUrl: 'coin-save.html',
})
export class CoinSavePage {

  coin_list=[];
  mycoins:any;
  pltname = '';
  constructor(public view:ViewController,public platform:Platform,public navCtrl: NavController, public navParams: NavParams) {
    if(this.platform.is('ios')){
      this.pltname = 'ios';
      console.log(this.pltname);
    }
    else if(this.platform.is('android')){
      this.pltname = 'android';
      console.log(this.pltname);
    }
    var data=this.navParams.get('user');
    console.log(data);
    data=data.accumulation;
    this.mycoins=Number(this.navParams.get('user').point);

    var cnt=0;
    for(var i in data){
      if(Number(data[i].coin)!=0){
        this.coin_list[cnt]=data[i];

        this.coin_list[cnt].coin=
          Number(this.coin_list[cnt].coin);
  
        this.coin_list[cnt].reason=
          String(this.coin_list[cnt].reason);
  
        this.coin_list[cnt].date=
          String(this.coin_list[cnt].date);
        
        if(this.coin_list[cnt].coin!=0) cnt++;
      }
    }
    console.log(this.coin_list)

    let backAction =  platform.registerBackButtonAction(() => {
      this.view.dismiss();
      backAction();
    },2)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoinSavePage');
  }

  goback(){
    this.navCtrl.pop();
  }

}
