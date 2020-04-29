import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  mycoins

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var data=this.navParams.get('data').accumulation;
    this.mycoins=this.navParams.get('data').point;
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoinSavePage');
  }

  goback(){
    this.navCtrl.pop();
  }

}
