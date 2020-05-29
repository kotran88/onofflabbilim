import { Component } from '@angular/core';
import { NavController, NavParams,Platform, AlertController, ViewController,LoadingController } from 'ionic-angular';
import { DeliveryAreaPage } from '../delivery-area/delivery-area';
import firebase from 'firebase/app';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IamportCordova, PaymentObject } from '@ionic-native/iamport-cordova';

import { Http, RequestOptions, Headers} from '@angular/http';
import { TspagePage } from './../tspage/tspage'
/**
 * Generated class for the ConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var naver;
@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
})
export class ConfirmPage {
  user : any;
  game : any;
  hardware : any;
  peripheral : any;
  totalprice : any;
  gameprice : any;
  contrast : any;
  
  startDate: any;
  endDate: any;
  startDate_text: any;
  endDate_text: any;

  lat:any;
  lng:any;
  hwArray = [];

  Delivery:any;
  Delivery_check=false;
  resultAddress : any;
  admin:any;
  firemain = firebase.database().ref();
  lastchecked : any;
  selected : any;
  count : any;
  newcount : any;
  totalcoins:any;
  diff:any=3;
  lloading:any;
  coinprice:any;
  sale_data:any;

  constructor(public viewCtrl:ViewController,public navCtrl: NavController,public loading:LoadingController, public navParams: NavParams,public http:Http,public platform:Platform,
  public geo:Geolocation,  public alertCtrl: AlertController) {
    this.user = this.navParams.get("user");
    this.totalprice = this.navParams.get("price");
    this.game = this.navParams.get("game");
    this.hardware = this.navParams.get("hw");
    this.peripheral = this.navParams.get("peri");
    this.gameprice = this.navParams.get("gameprice");
    this.contrast = this.navParams.get("contrast");
    this.coinprice=this.navParams.get("coin");
    this.sale_data=this.navParams.get("sale");

    this.startDate = this.navParams.get("start");
    this.endDate = this.navParams.get("end");
    this.startDate_text = this.navParams.get("start_text");
    this.endDate_text = this.navParams.get("end_text");
    this.diff=this.navParams.get("diff");
    console.log(this.user);

    let backAction =  platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    },2)
    this.firemain.child('admin').once('value').then((snap)=>{
      this.admin=snap.val();
    })


    for(var k in this.user){
      console.log(k);
      if(k=='adress'){
        console.log(this.user[k].adress);
        this.resultAddress = this.user[k].adress;
        this.Delivery=this.user[k];
        if(this.resultAddress===undefined) this.Delivery_check=false;
        else this.Delivery_check=true;
      }
    }

    console.log(this.totalprice);
    console.log(this.game);
    console.log(this.hardware);
    console.log(this.peripheral);
    console.log(this.gameprice);
    console.log(this.contrast);
      for(var game in this.hardware){
        if(game == 'hd'){
          if(this.hardware[game]!=undefined){
          console.log(this.hardware[game].name);
          this.hwArray.push(this.hardware[game].name);
        }
      }
    }
   
    console.log(this.hwArray);
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
    alert.present({animate:false});
  }

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
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
  payment(){
    if(this.payment_check()===false){
      return;
    }
    var data = {
      pay_method: 'card',
      merchant_uid: 'mid_' + new Date().getTime(),
      name: '게임/게임기 대여',
      amount: this.totalprice,
      app_scheme: 'ionickcp',
      buyer_email: '',
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
          console.log("결제 완료 ")
          console.log("payment is : ");
          console.log(a);
          console.log(this.hardware);
          // console.log(this.coins);
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
          var a  = ({ "phone": this.user.phone, "key": k, "status": "paid", "startDate": this.startDate_text, "endDate": this.endDate_text, "diff": this.diff, "orderdate": nnow, "game": this.game, "totalprice": this.totalprice, "payment": this.totalprice })
      
          if (this.hardware != undefined) {
            var k = this.firemain.child("users").child(this.user.phone).child("orderlist").push().key;
            this.firemain.child("users").child(this.user.phone).child("orderlist").child(k).update({ "phone": this.user.phone, "key": k, "status": "paid", "startDate": this.startDate_text, "endDate": this.endDate_text, "diff": this.diff, "orderdate": nnow, "game": this.game, "hardware": this.hardware, "totalprice": this.totalprice, "payment": this.totalprice }).then(() => {
              var delivery_time:any;
              if(hour<9) delivery_time="배송예정시각은 오늘("+now.getDate()+") 오전 9시~11시 입니다.";
              else if(hour>=9&&hour<13){delivery_time="배송예정시각은 오늘("+now.getDate()+") 오후 3시~5시 입니다.";}else{
                delivery_time="배송예정시각은 내일("+tomorrow.getDate()+")일 오전 9시~ 11시 입니다"
              }
              this.confirmAlert2("<p>주문이 완료되었습니다.</p><p>마이 페이지에서 상세내역 확인이 가능합니다.</p>"+delivery_time);
              this.coin_check();
              this.game_stock_check();
              this.send_push('주문이 들어왔습니다.',this.user.name+'님이 주문을 하셨습니다.','');
              setTimeout(() => {
                this.navCtrl.setRoot(TspagePage);
                // this.viewCtrl.dismiss();
              }, 1000);
            }).catch((e) => {
              console.log(e);
            })
      
          } 
          else {
      
            var k = this.firemain.child("users").child(this.user.phone).child("orderlist").push().key;
            this.firemain.child("users").child(this.user.phone).child("orderlist").child(k).update({ "phone": this.user.phone, "key": k, "status": "paid", "startDate": this.startDate_text, "endDate": this.endDate_text, "diff": this.diff, "orderdate": nnow, "game": this.game, "totalprice": this.totalprice, "payment": this.totalprice }).then(() => {
              var delivery_time:any;
              if(hour<9) delivery_time="배송예정시각은 오늘("+now.getDate()+") 오전 9시~11시 입니다.";
              else if(hour>=9&&hour<13){delivery_time="배송예정시각은 오늘("+now.getDate()+") 오후 3시~5시 입니다.";}else{
                delivery_time="배송예정시각은 내일("+tomorrow.getDate()+")일 오전 9시~ 11시 입니다"
              }
              this.confirmAlert2("<p>주문이 완료되었습니다.</p><p>마이 페이지에서 상세내역 확인이 가능합니다.</p>"+delivery_time);
              this.coin_check();
              this.game_stock_check();
              this.send_push('주문이 들어왔습니다.',this.user.name+'님이 주문을 하셨습니다.','');
              setTimeout(() => {
                this.navCtrl.setRoot(TspagePage);
                // this.viewCtrl.dismiss();
              }, 1000);
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
    });
  }

  near_enddate_update(root){

    console.log('near_enddate_update');
    console.log(root);

    var date:any;
    var date2:any;
    var date3:any;
    var total:any;
    var total2:any;

    root.once('value').then((snap)=>{
      if(snap.val().near_return_date!=undefined&&snap.val().near_return_date!=""){
        date=new Date(snap.val().near_return_date);
        date2=new Date(this.endDate);
        date3=new Date();

        date.setHours(0);date2.setHours(0);date3.setHours(0);
        date.setMinutes(0);date2.setMinutes(0);date3.setMinutes(0);
        date.setSeconds(0);date2.setSeconds(0);date3.setSeconds(0);

        console.log(date);
        console.log(date2);
        console.log(date3);

        total=date.getTime()-date2.getTime()
        total2=date3.getTime()-date.getTime();
  
        console.log(date.getTime());
        console.log(date2.getTime());
        console.log(date3.getTime());

        // total=total/(3600*24*1000)
        // total2=total2/(3600*24*1000)

        console.log(total);
        console.log(total2);
  
        if(total>0||total2>=0){
          root.update({'near_return_date':new Date(this.endDate)});
        }
      }
      else{
        root.update({'near_return_date':new Date(this.endDate)});
      }
    })
  }

  near_startdate_update(root){
    console.log('near_startdate_update');
    console.log(root);

    var date:any;
    var date2:any;
    var date3:any;
    var total:any;
    var total2:any;

    root.once('value').then((snap)=>{
      if(snap.val().near_start_date!=undefined&&snap.val().near_start_date!=""){
        date=new Date(snap.val().near_start_date);
        date2=new Date(this.startDate);
        date3=new Date();

        date.setHours(0);date2.setHours(0);date3.setHours(0);
        date.setMinutes(0);date2.setMinutes(0);date3.setMinutes(0);
        date.setSeconds(0);date2.setSeconds(0);date3.setSeconds(0);

        console.log(date);
        console.log(date2);
        console.log(date3);

        total=date.getTime()-date2.getTime()
        total2=date3.getTime()-date.getTime();
  
        console.log(date.getTime());
        console.log(date2.getTime());
        console.log(date3.getTime());

        total=total/(3600*24*1000)
        total2=total2/(3600*24*1000)

        console.log(total);
        console.log(total2);
  
        if(total>=0||total2>=0){
          root.update({'near_start_date':new Date(this.startDate)});
        }
      }
      else{
        root.update({'near_start_date':new Date(this.startDate)});
      }
    })
  }

  stock_update(root,num){
    root.update({reservation:String(Number(num)+1)})
  }
  stock_update2(hardware){
    console.log(hardware.itemcode.substring(0,2)+hardware.itemcode.substring(8,9));
    this.firemain.child('category').child(hardware.flag).child('reservation').
        child(hardware.itemcode.substring(0,2)+hardware.itemcode.substring(8,9)).once('value').then((snap)=>{
          console.log(snap.val())

          var text=hardware.itemcode.substring(0,2)+hardware.itemcode.substring(8,9);
          var root=this.firemain.child('category').child(hardware.flag).child('reservation');
          
          if(text==='CNS') root.update({'CNS':String(Number(snap.val())+1)})
          else if(text==='CNL') root.update({'CNL':String(Number(snap.val())+1)})
          else if(text==='CSP') root.update({'CSP':String(Number(snap.val())+1)})
          else if(text==='CNN') root.update({'CSN':String(Number(snap.val())+1)})
          // root.child(text).update(String(Number(snap.val())+1));
    });
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
          console.log(this.game[g],snap.val());
          if(snap.val()[s].itemcode===this.game[g].itemcode){
            console.log(this.game[g].name)
            this.stock_update(root.child(s),snap.val()[s].reservation)
            this.near_enddate_update(root.child(s));
            this.near_startdate_update(root.child(s));
            break;
          }
        }
      }
    })
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmPage');
  }
  coin_check(){
    var now=this.today();
    this.firemain.child('users').child(this.user.phone).child('accumulation').child(now.toString())
    .update({reason:"밍 포인트 사용",coin:-Number(this.coinprice/this.sale_data.coin.price),date:now})
    this.firemain.child('users').child(this.user.phone).update({point:Number(this.user.point)})
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
  loading_on(){
    this.lloading = this.loading.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
    });
    this.lloading.present();
  }

  loading_off(){
    if(this.lloading!=undefined){
      this.lloading.dismiss()
    }
   
  }
  geolocation_update(){
    this.loading_on();
    this.geo.getCurrentPosition().then((resp) => {
      console.log(resp);
      console.log(resp.coords)
      // resp.coords.latitude
      // resp.coords.longitude
      this.lat=resp.coords.latitude;
      this.lng=resp.coords.longitude;

    this.loading_off();
      this.reversegeo();

    }).catch((error) => {

      this.confirmAlert2("위치정보는 절대로 수집되지 않으며, 서비스 가능 지역인지 파악하기 위함입니다.")
      this.loading_off();
      console.log('Error getting location', error);
    });
  }

  Delivery_area(){
    this.navCtrl.push(DeliveryAreaPage,{'user':this.user,"Delivery":this.Delivery}).then(() => {
      this.navCtrl.getActive().onDidDismiss(data => {
        if(data){


          console.log(data);
          this.Delivery=data;
          this.resultAddress=this.Delivery.adress;
          this.Delivery_check=true;


          this.firemain.child("users").child(this.user.phone).child('adress').update({
            name:this.user.name,
            phone:this.user.phone,
            code:data.code,
            adress:data.adress,
            detail_adress:data.detail_adress,
          })


        }
      })
    })
  }
  
  view(i) {
    //0번째 선택 , 1번째 선택
    // 0번째 선택되면

    if(this.lastchecked==undefined){
      this.lastchecked=-1;
    }
    this.selected=i;
    if(this.lastchecked==i){
      this.count++;
      //클릭한거 또 클릭함
     
      if(this.count%2==0){
        this.selected=i;

        this.count=0;
        
      }else{
        this.selected=-1;

      }
      //already clicked
    }else{
      //새로운거 클릭함.
      this.count=0;
      this.newcount++;
      if(this.newcount%2==0){
       
        this.selected=1;

      }else{
        this.selected=i;

        this.newcount=0;

      }
    }
    this.lastchecked=i;
    console.log(this.selected+"is selected")
  }

  payment_check():boolean{
    console.log("결제");
    console.log(this.totalprice);
    var ck=true;

    if(this.Delivery_check===false){
      this.confirmAlert2('어디로 밍을 해야할지 몰라요.<br>주소를 입력해주세요.');
      ck=false;
    }
    else if(this.resultAddress.indexOf("전북 전주")==1 || this.resultAddress.indexOf("전북 익산")==1){
      console.log("전주");
      this.confirmAlert2("현재 전주와 익산 지역만 배송이 가능합니다.<br>주소를 확인해주세요.");
      ck=false;
    }
    else ck=true;
    
    return ck;
  }
}
