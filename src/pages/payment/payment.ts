import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ViewController, Platform } from 'ionic-angular';
import * as $ from 'jquery'
import firebase from 'firebase';
import { IamportCordova, PaymentObject } from '@ionic-native/iamport-cordova';
import { HomePage } from '../home/home';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Http, RequestOptions, Headers} from '@angular/http';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var naver;
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  firemain = firebase.database().ref();

  sale_data:any;
  user: any;
  diff: any;
  hardware: any;
  game = [];
  startDate: any;
  endDate: any;
  contrast: number = 0;
  coins: any;
  totalcoins;
  count = 0;
  lat:any;
  lng:any;

  totalpaymoney: any;
  discount: any;
  gamediscount: any;
  originpay: any;
  longdiscount: any;
  longdiscount_text:any;

  hwprice: any;
  hwdiscount: any;
  gameprice: any;
  gameprice_piece:any;
  hardwareprice: any;
  coindiscount: any;
  admin:any;

  console_sale_gameprice:any;

  tick: any;
  peripheral: any;
  periprice:any;
  constructor(public platform:Platform, public http:Http,private geolocation: Geolocation,public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
    this.user = this.navParams.get("user");
    this.diff = this.navParams.get("diff");
    this.hardware = this.navParams.get("hardware");
    this.game = this.navParams.get("game");
    this.startDate = this.navParams.get("start");
    this.endDate = this.navParams.get("end");
    this.sale_data=this.navParams.get("sale");
    this.peripheral=this.navParams.get("peripheral");
    console.log(this.contrast);
    console.log(this.peripheral);
  
    let backAction =  platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    },2)
    this.firemain.child('admin').once('value').then((snap)=>{
      this.admin=snap.val();
    })
    // this.diff = 19;
    // this.diff = 31;
    if(this.user.point===undefined) this.user.point="10"

    this.coins = this.user.point;
    this.totalcoins=this.coins;
    console.log("payment user is : "+this.coins);
    console.log(this.user);
    console.log(this.diff);
    console.log(this.hardware);
    console.log(this.game);
    console.log(this.startDate);
    console.log(this.endDate);
    // console.log(this.hardware.pricenormal);
    if (this.hardware != undefined) {
      var ticknumber = 0;
      ticknumber = Math.ceil(this.hardware.pricenormal * 0.33);
      console.log(ticknumber);
      for(var sd in this.sale_data.ticknumber){
        if(ticknumber===Number(sd)){
          this.tick=this.sale_data.ticknumber[sd];
        }
      }
    }

    this.rangeSlider();
    var a = 0;
    var gamedct = 0;
    this.console_sale_gameprice=0;
    this.gamediscount=0;
    for (var i = 0; i < this.game.length; i++) {
      a += this.game[i].price * this.diff;
      // this.originpay = a + b;
      if (this.hardware != undefined) {
        gamedct = this.game[i].price * ((100-Number(this.sale_data.percentage.console.split('%')[0]))/100);
        this.console_sale_gameprice+=Number(this.game[i].price * Number(this.sale_data.percentage.console.split('%')[0])/100);
      }
      else if (this.hardware == undefined) {
        gamedct = this.game[i].price * 1;
      }
      this.gamediscount+=gamedct;
      this.game[i].saleprice=gamedct;
    }
    console.log(this.game);
    this.console_sale_gameprice*=this.diff;
    console.log(this.console_sale_gameprice)
    // this.gamediscount = gamedct;
    this.gameprice = this.gamediscount * this.diff;
    console.log(this.gamediscount);
    console.log(this.gameprice);
    console.log(this.sale_data)
    this.choice();
    console.log(this.coins);
  }
  coin: any;

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
  }
    
  game_stock_check(){
    if(this.hardware!=undefined){
      console.log('hardware');
      this.stock_update2(this.hardware);
    }

    var root=this.firemain.child('category').child(this.game[0].flag).child('software');

    root.once('value').then((snap)=>{
      for(var g in this.game){
        for(var s in snap.val()){
          if(snap.val()[s].name===this.game[g].name){
            this.stock_update(root.child(s),snap.val()[s].stock)
            this.rental_date_update(root.child(s));

            break;
          }
        }
      }
    })
  }
  rental_date_update(root){

    console.log('rental_date_update');
    console.log(root);

    var date:any;
    var date2:any;
    var total:any;

    root.once('value').then((snap)=>{
      if(snap.val().near_return_date!=undefined){
        date=new Date(snap.val().near_return_date);
        console.log(date);
  
        date2=new Date(this.endDate);
        console.log(date2);

        total=date.getTime()-date2.getTime()
  
        console.log(date.getTime());
        console.log(date2.getTime());

        console.log(total/(3600*24*1000));
        total=total/(3600*24*1000)
  
        if(total>0){
          root.update({'near_return_date':new Date(this.endDate)});
        }
      }
      else{
        root.update({'near_return_date':new Date(this.endDate)});
      }
    })
  }

  stock_update(root,num){
    root.update({stock:String(Number(num)-1)})
  }
  stock_update2(hardware){
    console.log(hardware.itemcode.substring(0,2)+hardware.itemcode.substring(8,9));
    this.firemain.child('category').child(hardware.flag).child('console_stock').
        child(hardware.itemcode.substring(0,2)+hardware.itemcode.substring(8,9)).once('value').then((snap)=>{
          console.log(snap.val())

          var text=hardware.itemcode.substring(0,2)+hardware.itemcode.substring(8,9);
          var root=this.firemain.child('category').child(hardware.flag).child('console_stock');
          
          if(text==='CNS') root.update({'CNS':String(Number(snap.val())-1)});
          else if(text==='CNL') root.update({'CNL':String(Number(snap.val())-1)});
          else if(text==='CSP') root.update({'CSP':String(Number(snap.val())-1)});
    });

    // .update(hardware.itemcode.substring(0,2)+hardware.itemcode.substring(8,9):String(Number(hardware.stock)-1))
  }
  geolocation_update(){
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      console.log(resp.coords)
      // resp.coords.latitude
      // resp.coords.longitude
      this.lat=resp.coords.latitude;
      this.lng=resp.coords.longitude;
      this.reversegeo();

    }).catch((error) => {

      this.confirmAlert("위치정보는 절대로 수집되지 않으며, 서비스 가능 지역인지 파악하기 위함입니다.")
      console.log('Error getting location', error);
    });
  }


  st_format(text,len):String{
    text=String(text);
    for(var i=text.length;i<len;i++){
      text='0'+text;
    }
    return text;
  }

  today():String{
    var t=new Date();
    var r=
        this.st_format(t.getFullYear(),4)+'-'+this.st_format(t.getMonth()+1,2)+'-'+this.st_format(t.getDate(),2)
        +'|'+
        this.st_format(t.getHours(),2)+':'+this.st_format(t.getMinutes(),2)+':'+this.st_format(t.getSeconds(),2);
    return r;
  }

  coin_check(){
    var now=this.today();
    this.firemain.child('users').child(this.user.phone).child('accumulation').child(now.toString())
    .update({reason:"밍 포인트 사용",coin:-Number(this.totalcoins-this.coins),date:now})
    // this.firemain.child('users').child('point').once('value').then((snap)=>{
    this.firemain.child('users').child(this.user.phone).update({point:Number(this.coins)})
    // })
  }
  reversegeo(){
    naver.maps.Service.reverseGeocode({
      location: new naver.maps.LatLng(this.lat, this.lng),
  }, (status,response)=> {
      if (status !== naver.maps.Service.Status.OK) {
        console.log("status not ok");
          console.log(status);
      }else{
        console.log("status  ok");
        console.log(status);
      }

      var result = response.result, // 검색 결과의 컨테이너
          items = result.items; // 검색 결과의 배열
          console.log(result);
          console.log(items[0].address);
          var res=items[0].address.split(" ");
          console.log(res.length);
          console.log(res[1]+"시")
          if(res[1].indexOf("전주")||res[1].indexOf("익산")){
           this.payment();
          }else{
            this.confirmAlert2("현재 전주와 익산지역에서만 서비스 가능합니다!")
            return;
          }
         
        });
  }

payment(){

    var data = {
      pay_method: 'card',
      merchant_uid: 'mid_' + new Date().getTime(),
      name: '게임/게임기 대여',
      amount: this.totalpaymoney + "",
      app_scheme: 'ionickcp',
      buyer_email: '',
      buyer_name: this.user.name,
      buyer_tel: '010-1234-5678',
      buyer_addr: '서울특별시 강남구 삼성동',
      buyer_postcode: '123-456'
    };

    var PaymentObject = {
      userCode: "imp58611631",
      data: data,
      callback: (response) => {
        console.log(response);
        if (response.imp_success == "true") {
          console.log("success")
          console.log(this.hardware);
          console.log(this.coins);
          console.log("coin is")
          var now = new Date();

var tomorrow = new Date();
tomorrow.setDate(now.getDate()+1);
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var date = now.getDate();
          var hour = now.getHours();
          var min = now.getMinutes();
          var nnow = year + "-" + month + "-" + date + " " + hour + ":" + min;
          console.log(nnow);
          if (this.hardware != undefined) {
            var k = this.firemain.child("users").child(this.user.phone).child("orderlist").push().key;
            this.firemain.child("users").child(this.user.phone).child("orderlist").child(k).update({ "phone": this.user.phone, "key": k, "status": "paid", "startDate": this.startDate, "endDate": this.endDate, "diff": this.diff, "orderdate": nnow, "game": this.game, "hardware": this.hardware, "totalprice": this.totalpaymoney, "payment": this.totalpaymoney }).then(() => {
              var delivery_time:any;
              if(hour<9) delivery_time="배송예정시각은 오늘("+now.getDate()+") 오전 9시~11시 입니다.";
              else if(hour>=9&&hour<13){delivery_time="배송예정시각은 오늘("+now.getDate()+") 오후 3시~5시 입니다.";}else{
                delivery_time="배송예정시각은 내일("+tomorrow.getDate()+")일 오전 9시~ 11시 입니다"
              }
              this.confirmAlert2("<p>주문이 완료되었습니다.</p><p>마이 페이지에서 상세내역 확인이 가능합니다.</p>"+delivery_time);
              this.coin_check();
              this.game_stock_check();
              this.send_push('주문이 들어왔습니다.',this.user.name+'님이 주문을 하셨습니다.','');
              // this.geolocation_update(this.firemain.child("users").child(this.user.phone).child("orderlist").child(k));
              // this.firemain.child("users").child(this.user.phone).update({ "point": this.coins })
              this.navCtrl.setRoot(HomePage);
            }).catch((e) => {
              console.log(e);
            })

          } else {

            var k = this.firemain.child("users").child(this.user.phone).child("orderlist").push().key;
            this.firemain.child("users").child(this.user.phone).child("orderlist").child(k).update({ "phone": this.user.phone, "key": k, "status": "paid", "startDate": this.startDate, "endDate": this.endDate, "diff": this.diff, "orderdate": nnow, "game": this.game, "totalprice": this.totalpaymoney, "payment": this.totalpaymoney }).then(() => {
              var delivery_time:any;
              if(hour<9) delivery_time="배송예정시각은 오늘("+now.getDate()+") 오전 9시~11시 입니다.";
              else if(hour>=9&&hour<13){delivery_time="배송예정시각은 오늘("+now.getDate()+") 오후 3시~5시 입니다.";}else{
                delivery_time="배송예정시각은 내일("+tomorrow.getDate()+")일 오전 9시~ 11시 입니다"
              }
              this.confirmAlert2("<p>주문이 완료되었습니다.</p><p>마이 페이지에서 상세내역 확인이 가능합니다.</p>");
              this.game_stock_check();
              this.coin_check();
              this.send_push('주문이 들어왔습니다.',this.user.name+'님이 주문을 하셨습니다.','');
              // this.geolocation_update(this.firemain.child("users").child(this.user.phone).child("orderlist").child(k));
              // this.firemain.child("users").child(this.user.phone).update({ "points": this.coins })
              this.navCtrl.setRoot(HomePage);
            }).catch((e) => {
              console.log(e);
            })
          }
        }
      },
    }
    // 아임포트 관리자 페이지 가입 후 발급된 가맹점 식별코드를 사용
    IamportCordova.payment(PaymentObject)
      .then((response) => {
        this.confirmAlert2("success"+'\n'+JSON.stringify(response))
      })
      .catch((err) => {
        this.confirmAlert2('error : '+err)
      })
      ;
}
  ordering() {
    console.log(this.user);
    if(this.user.name=="홍길동"){
      //payment startedd
      this.payment();
    }else{
      //geo check and if ok, payment started
      this.geolocation_update();
    }
    
  }
  confirmAlert(str) {
    let alert = this.alertCtrl.create({
      subTitle: str,
      buttons: [
        {
          role: 'Cancel',
          text: '취소',
          handler: () => {
            console.log('Buy clicked');
          }
        },
        {
          role: 'Ok',
          text: '권한 허용하고 이동하기',
          handler: () => {
            this.payment();
          }
        }]

    });
    alert.present({ animate: false });
  }

  // confirmAlert(str) {

    
  //   let alert = this.alertCtrl.create({
  //     subTitle: str,
  //     buttons: [
  //       {
  //         role: 'Cancel',
  //         text: '취소하기',
  //         handler: () => {
  //           console.log('Buy clicked');
  //         }
  //       },
  //       {
  //         role: 'Ok',
  //         text: '권한 허용하고 진행',
  //         handler: () => {
  //           this.geolocation_update();
  //           console.log('Buy clicked');
  //         }
  //       }]

  //   });
  //   alert.present({ animate: false });
  // }
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
  choice() {
    var a = 0;
    var b = 0;
    for (var i in this.game) {this.game[i].price; a += this.game[i].price * this.diff }
    for (var j in this.peripheral) { b += this.peripheral[j].pricedaily * this.diff }
    console.log(a);
    console.log(b);
    if (this.hardware != undefined) {
      for(var sd in this.sale_data.deposit){
        if(this.hardware.name===sd){
          this.originpay=Number(this.sale_data.deposit[sd][String(this.contrast)]) * this.diff + a + b;
          console.log(this.originpay);
          console.log(Number(this.sale_data.deposit[sd][String(this.contrast)]))
          console.log(this.diff);
          console.log(a);
          a*=((100-Number(this.sale_data.percentage.console.split('%')[0]))/100);
          for(var sd2 in this.sale_data.deposit[sd]){
            if(this.contrast===Number(sd2)){
              console.log(sd2);
              this.hwprice = Number(this.sale_data.deposit[sd][sd2]);
            }
          }
        }
      }
      this.hardwareprice = this.hwprice * this.diff;
      console.log(this.hardwareprice);
      console.log(this.sale_data)
      
      this.totalpaymoney = this.hardwareprice + a + b; 
      this.longdiscount=0;
      for(var sd in this.sale_data.percentage.date){
        if(this.diff>=Number(sd.split('~')[0])&&(Number(sd.split('~')[1])===0||this.diff<Number(sd.split('~')[1]))){
          this.longdiscount = 
          this.totalpaymoney-(this.totalpaymoney * 
          ((100-Number(this.sale_data.percentage.date[sd].split('%')[0]))/100));
          this.longdiscount_text=this.sale_data.percentage.date_text[sd];
          break;
        }
      }
      console.log(this.longdiscount)
    }
    if (this.hardware == undefined) {
      this.originpay = this.gameprice;
      this.totalpaymoney=this.gameprice;

      for(var sd in this.sale_data.percentage.date){
        if(this.diff>=Number(sd.split('~')[0])&&(Number(sd.split('~')[1])===0||this.diff<Number(sd.split('~')[1]))){
          this.longdiscount =
          this.totalpaymoney-(this.gameprice * 
          ((100-Number(this.sale_data.percentage.date[sd].split('%')[0]))/100));
          this.longdiscount_text=this.sale_data.percentage.date_text[sd];
          break;
        }
      }
    }

    this.totalpaymoney-=this.longdiscount;
    this.totalpaymoney+=this.contrast;
    this.originpay+=this.contrast;
    this.gameprice_piece=this.gameprice/this.game.length;
    console.log(this.originpay);
  }
  
  clickcoin(n) {
    console.log(this.coins);
    console.log(this.totalpaymoney);
    // this.count+=n;
    console.log(this.count);

    this.count+=n;
    this.coins-=n;
    this.coindiscount=this.count * Number(this.sale_data.coin.price);
    this.totalpaymoney-=n*Number(this.sale_data.coin.price);
    console.log(this.totalpaymoney);
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

  godown(){
    console.log("godown")
    console.log(this.coins);

    if(this.coins<=0){
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

  send_push(header,content,url){
    console.log('ready');

    // this.status_change(this.check_order,'delivered');

    console.log("sendpushnotification")
    let data={
      "app_id": "6505b348-1705-4d73-abe4-55ab40758266",
      "include_player_ids": this.admin.deviceIds,
      "headings":{"en":header},
      "ios_badgeType":"Increase",
      "ios_badgeCount":1,
      "data": {"welcome": "pdJung", "store":'this.store'},
      "contents": {"en": content},
      "big_picture":String(url),
      "large_icon":String(url),
    }
    console.log(data);
    let headers = new Headers({ 'Content-Type': 'application/json','Authorization':'Basic MDMzN2UxYjUtYzNiOS00YmY5LThjNDUtYzAyYmMwOTkwMTMw' });
    let options = new RequestOptions({headers:headers});
    this.http.post('https://onesignal.com/api/v1/notifications', JSON.stringify(data), options).toPromise().then((e)=>{
      console.log("then come")
      console.log(e);
    }).catch((e)=>{
      console.log('error');
      console.log(e);
    })
  }
  
  goup(){
    console.log("goup")
    console.log(this.coins);
  
    if(this.coins>=this.totalcoins){
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
}