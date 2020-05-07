import { Component } from '@angular/core';
import { AlertController, Platform, ViewController, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import firebase from 'firebase';


import { OrderpagePage } from './../../pages/orderpage/orderpage';
// import undefined from 'firebase/empty-import';
// import undefined from 'firebase/empty-import';

/**
 * Generated class for the ModalpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modalpage',
  templateUrl: 'modalpage.html',
})
export class ModalpagePage {
  sale_data: any;
  hardwarearray = [];
  hardwarename: any;
  gamearraytrue = [];
  diff: any;
  startDate: any;
  totalprice2 = 0;
  endDate: any;
  total = 0;
  totalprice = 0;
  flag: any;
  hardware: any;
  user: any;
  points: any;
  firemain = firebase.database().ref();
  perihardware = [];
  peripheralitem = "no";
  peripheralitem2 = "no";
  tomorrowflag:any;

  constructor(public view: ViewController, public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    console.log('modalpage come')
    this.sale_data = this.navParams.get("sale");
    this.flag = this.navParams.get("flag");
    this.hardware = this.flag.flag
    this.gamearraytrue = this.navParams.get("list");
    this.startDate = this.navParams.get("startDate");
    this.endDate = this.navParams.get("endDate");
    this.diff = this.navParams.get("diff");
    this.user = this.navParams.get("user");
    this.tomorrowflag=this.navParams.get("tomorrowflag");
    this.generatehardware();
    console.log(this.sale_data);
    console.log("flag : ");
    console.log(this.flag);
    console.log("user : ");
    console.log(this.user);
    console.log("hardware :" + this.hardware);
    console.log("startDate :" + this.startDate);
    console.log("endDate : " + this.endDate);
    console.log("diff : " + this.diff);
    console.log(this.peripheralitem); 

    let backAction = platform.registerBackButtonAction(() => {
      console.log("secondssssssss");
      this.view.dismiss();
      backAction();
    }, 2)
    if (this.user == null) {
      this.points = 0;
    } else {
      this.points = this.user.point;
    }

    // for (var i = 0; i < this.gamearray.length; i++) {
    //   var flag = this.gamearray[i].fflag;
    //   console.log(flag)
    //   if (flag == true) {
    //     this.gamearraytrue.push(this.gamearray[i])
    //     this.count++;
    //   }
    // }
    // window.alert(this.count)
    console.log(this.gamearraytrue)
    var a = 0;
    for (var i = 0; i < this.gamearraytrue.length; i++) {
      a += this.gamearraytrue[i].price * this.diff;
    }
    this.total = a;
    this.totalprice = a;
    this.totalprice2 = a;

    console.log(this.peripheralitem);
   
  }
  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
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
  orderpage() {
    console.log("come to orderpage")
    this.firemain.child('category').child(this.gamearraytrue[0].flag).child('hardware').once('value').then((snap) => {
      console.log(snap.val())
      console.log(this.hardwarename)
      for (var i in snap.val()) {
        if (Number(snap.val()[i].stock) > 0 && this.hardwarename != undefined
          && this.hardwarename.itemcode.substring(0, 2) === snap.val()[i].itemcode.substring(0, 2)
          && this.hardwarename.itemcode.substring(8, 9) === snap.val()[i].itemcode.substring(8, 9)
        ) {
          console.log(this.hardwarename);
          console.log(i, snap.val()[i])
          console.log('checked')
          this.hardwarename.itemcode = snap.val()[i].itemcode;
          console.log(snap.val()[i].itemcode)
          console.log(this.hardwarename.itemcode);
          break;
        }
      }
      this.perihardware.push(this.peripheralitem,this.peripheralitem2);
      console.log(this.perihardware);
      this.navCtrl.push(OrderpagePage, { "startDate": this.startDate, "endDate": this.endDate,"tomorrowflag":this.tomorrowflag, "diff": this.diff, "gamearray": this.gamearraytrue, "hardware": this.hardwarename, "user": this.user, "sale": this.sale_data, "peripheral":this.peripheral, "peripheralname":this.perihardware }).then(() => {
        this.navCtrl.getActive().onDidDismiss(data => {
          this.view.dismiss();
        });
      });
    })
  }
  teest() {
    //   var all_select=document.getElementsByTagName('select')[0];
    //   console.log(all_select.length);
    //   console.log(all_select);
    //   for (var i = 0; i < all_select.length; i++) {
    //     console.log(i+" issss"+all_select[i]);
    //     all_select[i].addEventListener("click",function(e){
    //       console.log(i+"is clicked");
    //     })
    // }

  }

  peripheral = [];
  generatehardware() {
    this.firemain.child("category").once("value", (snapshot) => {
      for (var a in snapshot.val()) {
        console.log(a)
        if (a == this.hardware) {
          for (var b in snapshot.val()[a]) {
            console.log(b);
            console.log(snapshot.val()[a][b])
            if (b == "hardware") {
              for (var c in snapshot.val()[a][b]) {
                console.log(snapshot.val()[a][b][c].stock);

                if (this.hardwarearray.length === 0) {
                  console.log(snapshot.val()[a][b][c])
                  this.hardwarearray.push(snapshot.val()[a][b][c]);
                }

                for (var i = 0; i < this.hardwarearray.length; i++) {
                  if (this.hardwarearray[i].itemcode.substring(0, 2)
                    === snapshot.val()[a][b][c].itemcode.substring(0, 2) &&
                    this.hardwarearray[i].itemcode.substring(8, 9)
                    === snapshot.val()[a][b][c].itemcode.substring(8, 9)) {
                    this.hardwarearray[i].stock += Number(snapshot.val()[a][b][c].stock);
                    break;
                  }
                  else if (i === this.hardwarearray.length - 1) {
                    console.log(snapshot.val()[a][b][c])
                    this.hardwarearray.push(snapshot.val()[a][b][c]);
                  }
                }
              }

              for (var j in this.hardwarearray) {
                if (Number(this.hardwarearray[j].stock) <= 0) {
                  this.hardwarearray[j].name += "[일시품절]"
                  console.log(this.hardwarearray[j].name);
                }
              }
            }
            if (b == "peripheral") {
              console.log(snapshot.val()[a][b]);
              for (var peri in snapshot.val()[a][b]) {
                console.log(peri);
                console.log(snapshot.val()[a][b][peri]);
                this.peripheral.push(snapshot.val()[a][b][peri]);
                // for (var m = 0; m < this.peripheral.length; m++) {
                //   if (this.peripheral[m].itemcode.substring(0, 2)
                //     === snapshot.val()[a][b][peri].itemcode.substring(0, 2) &&
                //     this.peripheral[m].itemcode.substring(8, 9)
                //     === snapshot.val()[a][b][peri].itemcode.substring(8, 9)) {
                //     this.peripheral[m].stock = this.peripheral[m].stock
                //   }
                //   else if (m === this.peripheral.length - 1) {
                //     console.log(snapshot.val()[a][b][peri])
                //     this.peripheral.push(snapshot.val()[a][b][peri]);
                //   }
                // }
              }
            }
          }
        }
      }
      console.log(this.hardwarearray);
      console.log(this.peripheral);
    })
  }
  game = "no";
  gameboolean: boolean = true;
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalpagePage');
    console.log($('.peribox'))
    console.log(this.peripheralitem);

    $(document).ready(() => {
      // code goes here
      $('#mySelect').change((e) => {
        console.log(e.target.value)
        if (e.target.value == 'no') {
          this.game = "no";
          if (this.game == 'no') { this.gameboolean = true }
        }
        var ck = false;
        this.hardwarename = undefined;
        for (var i = 0; i < this.hardwarearray.length; i++) {
          if (this.hardwarearray[i].name == e.target.value.split("/")[0]) {
            if (Number(this.hardwarearray[i].stock) <= 0) {
              this.confirmAlert2('재고가 없는 게임기 입니다.');
              e.target.value = "no"
              this.game = "no";
              if (this.game == 'no') { this.gameboolean = true }
              break;
            }
            else {
              this.hardwarename = this.hardwarearray[i];
              ck = true;
              this.game = e.target.value.split("/")[0];
              if (this.game == '닌텐도 스위치') { this.gameboolean = false }
              if (this.game == 'Playstation Pro') { this.gameboolean = false }
              if (this.game == '스위치 라이트') { this.gameboolean = true }
              if (this.game == 'no') { this.gameboolean = true }
            }
          }
        }
        if (ck === true) {
          console.log(e.target.value);
          this.totalprice2 = this.totalprice;
          this.totalprice2 += Number(e.target.value.split("/")[1]);
          this.total = this.totalprice2;
          this.game = e.target.value.split("/")[0];
          if (this.game == '닌텐도 스위치') { this.gameboolean = false }
          if (this.game == 'Playstation Pro') { this.gameboolean = false }
          if (this.game == '스위치 라이트') { this.gameboolean = true }
          if (this.game == 'no') { this.gameboolean = true }

          if (isNaN(this.total)) {
            this.total = 0;
          }
        }
        console.log(this.game);
        console.log(this.gameboolean);
        console.log(this.peripheralitem);
        
        
      });

      $(document).ready(() => {
        console.log("스위치");
        $('#peripheral').change((m) => {
          console.log(m.target.value)
        });
      });
      console.log($("#peripheral"))
      console.log(this.game);
    })
    console.log(this.peripheralitem);

  }
}
