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

  constructor(public view:ViewController,public platform:Platform,public navCtrl: NavController, public navParams: NavParams) {
    var data=this.navParams.get('data').accumulation;
    this.mycoins=Number(this.navParams.get('data').point);
    for(var i in data){
      this.coin_list[this.coin_list.length]=data[i];

      this.coin_list[this.coin_list.length-1].coin=
        Number(this.coin_list[this.coin_list.length-1].coin);

      this.coin_list[this.coin_list.length-1].reason=
        String(this.coin_list[this.coin_list.length-1].reason);

      this.coin_list[this.coin_list.length-1].date=
        String(this.coin_list[this.coin_list.length-1].date);
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
