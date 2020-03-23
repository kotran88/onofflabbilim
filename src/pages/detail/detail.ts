import { Component } from '@angular/core';
import { IonicPage, ModalController,ModalOptions,AlertController,ViewController,NavController,Events, NavParams } from 'ionic-angular';

import { DatePicker } from '@ionic-native/date-picker/ngx';

import { LoginpagePage} from './../../pages/loginpage/loginpage'
import { Modalbottom } from '../modalbottom/modalbottom';
import { ModalpagePage } from '../modalpage/modalpage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { GameDetailPage } from '../game-detail/game-detail';


/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  detail:any;
  arraying=[];
  mainimage:any;
  descriptionimage=[];
  firstshow:any=true;
  thirdshow:any=false;
  secondshow:any=false;
  fourthshow:any=false;
  today=new Date();
  count:any;
  date: any;
  expressmessage:any;
  selectedarray=[];
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  selectedgame:any;
  eventList: any;
  selectedEvent: any;
  selectedvalue:any="";
  thismonth:any;
  thisdate:any;
  endDate:any;
  startDate_text:any;
  endDate_text:any;
  gamearray=[];
  diff:any;
  maker:any;
  startDate:any= new Date().toISOString();
  user:any;
  logRatingChange(v){
    console.log(v)
  }



  datechange(mode){
    console.log(this.startDate);

    console.log(this.endDate)
    var a = new Date(this.startDate);
    var b = new Date(this.endDate);
    console.log(a);
    console.log(b);
    var diff=a.getTime()-b.getTime();
    var Difference_In_Days = diff / (1000 * 3600 * 24); 
    diff=Difference_In_Days
    console.log(diff)
    diff=Math.floor(diff);
    diff=Math.abs(diff);
    console.log(diff)
    this.diff=diff;

    // this.diff=this.diff+1;
    if(Difference_In_Days>0){
      if(mode===1){
        window.alert("대여 시작일이 반납일보다 늦을 수는 없습니다.")
        var a=new Date();
        this.startDate=a.toISOString();
        this.startDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
      }
      else {
        window.alert("반납일이 대여 시작일보다 빠를 수는 없습니다.")
        var a=new Date(this.startDate);
        a.setDate(a.getDate()+3);
        this.endDate=a.toISOString();
        this.endDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
      }
    }
  }

  pick_date(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => console.log('Got date: ', date),
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  constructor(public inapp:InAppBrowser,public modal:ModalController,public alertCtrl:AlertController,public view:ViewController, public events: Events,public datePicker:DatePicker,public navCtrl: NavController, public navParams: NavParams) {
    this.detail=navParams.get("a")
    this.user=navParams.get("user");
    console.log("user is : "+this.user);
   console.log(this.detail);
    var date = new Date();
    date.setDate(date.getDate() + 3);


    // if(date.getMonth()+1<10){
    //   this.endDate=date.getFullYear()+"-0"+(date.getMonth()+1)+"-"+date.getDate();
    // }else{
    //   this.endDate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    // }
    this.endDate=date.toISOString();
    var startDate2=new Date();
    console.log(this.startDate);
    console.log(this.endDate);

    console.log(date);
    console.log(startDate2)
    var diff=date.getTime()-startDate2.getTime();

    var Difference_In_Days = diff / (1000 * 3600 * 24); 
    var diff=Difference_In_Days;
    this.diff=Math.ceil(diff)
    this.gamearray=navParams.get("game");
    this.expressmessage=navParams.get("setting");
    this.maker=this.detail.maker;
    events.subscribe('star-rating:changed', (starRating) => {console.log(starRating)});
 

    for(var ii=0; ii<this.gamearray.length; ii++){
      this.gamearray[ii].fflag=false;
      this.gamearray[ii].check=false;
    }
    console.log(this.detail);
    console.log(this.gamearray);
    this.date = new Date();
    this.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    this.getDaysOfMonth();
    // this.loadEventThisMonth();
    console.log(this.detail)
    console.log("mmm")
    this.mainimage=this.detail.url;
    console.log(this.detail.mainbanner)
    for( var a in this.detail.mainbanner){
      console.log(this.detail.mainbanner[a])
      this.arraying.push(this.detail.mainbanner[a])
    }
    // for( var a in this.gamearray){
    //   console.log(this.gamearray[a])
    //   this.arraying.push(this.detail.mainbanner[a])
    // }
    for( var a in this.detail.descriptionimage){
      this.descriptionimage.push(this.detail.descriptionimage[a])
    }
    console.log(this.descriptionimage);
    console.log(this.arraying)

    this.thismonth=this.date.getMonth()+1;
    this.thisdate=this.date.getDate();


  }
  selectDate(v){
    console.log(v);
    this.selectedvalue=v+"";
  }
  openPicker(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => console.log('Got date: ', date),
      err => console.log('Error occurred while getting date: ', err)
    );
  }
  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    // this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentMonth =this.date.getMonth()+1;
    this.currentYear = this.date.getFullYear();
    if(this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for (var j = 0; j < thisNumOfDays; j++) {
      this.daysInThisMonth.push(j+1);
    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    // var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
    for (var k = 0; k < (6-lastDayThisMonth); k++) {
      this.daysInNextMonth.push(k+1);
    }
    var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
    if(totalDays<36) {
      for(var l = (7-lastDayThisMonth); l < ((7-lastDayThisMonth)+7); l++) {
        this.daysInNextMonth.push(l);
      }
    }
  }
  selectno(){
    this.firstshow=false;
    this.secondshow=false;
    this.thirdshow=false;
    this.fourthshow=false;
  }
  gotodetail(v){
    this.selectno();
    console.log(this.firstshow)
    console.log(v);
    if(v==1){
      this.firstshow=true;
    }
    if(v==2){
      this.secondshow=true;
    }
    if(v==3){
      this.thirdshow=true;
    }
    if(v==4){
      this.fourthshow=true;
    }
    location.href="#detail"
  }
  gameselected(v,i){
     this.count=0;
    this.gamearray[i].check=!this.gamearray[i].check;
    console.log(this.gamearray);
    if(this.gamearray[i].fflag==true){
      this.gamearray[i].fflag=false;
    }else{
      this.gamearray[i].fflag=true;
    }
    for(var j=0; j<this.gamearray.length; j++){
      if(this.gamearray[j].fflag==true){
        this.count++;
      }
    }
    console.log("count is : "+this.count);
  }
  goback(){
    this.view.dismiss();
  }
  goToday(){
    this.date=new Date(this.today.getFullYear(),this.today.getMonth()+1,0);
    this.getDaysOfMonth();
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  gotogamedetail(game){
    console.log(game);
    console.log("g")
    // const browser = this.inapp.create('https://store.nintendo.co.kr/70010000016050',"_blank","location=no");
    let modal = this.modal.create(GameDetailPage, {game:game}, { cssClass: 'test-modal' });
    modal.present();
  }
  
  ab(){
    console.log("callback")
  }
  confirmAlert(str) {
    let alert = this.alertCtrl.create({      
        subTitle: str,
        buttons: [{
          text: '취소',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '이동하기',
          handler: () => {
            console.log('Buy clicked');
            this.navCtrl.push(LoginpagePage);

          }
        }],
    });
    alert.present({animate:false});
  }
  orderpage(){
    console.log(this.detail);
   


    console.log(this.gamearray);
    for(var j=0; j<this.gamearray.length; j++){
      if(this.gamearray[j].fflag==true){
        this.count++;
      }
    }
    console.log(this.count);
    console.log(this.gamearray);
    var a = localStorage.getItem("loginflag");
    console.log(a);
      // this.navCtrl.push(OrderpagePage)

      var modaloption : ModalOptions={
        enableBackdropDismiss:true
      }
      let modal = this.modal.create(ModalpagePage,{"user":this.user,"startDate":this.startDate,"endDate":this.endDate,"diff":this.diff,"list":this.gamearray,"flag":this.detail},modaloption);
      modal.onDidDismiss(imagedata => {
        console.log(imagedata)
    });
    modal.present();




//  var data = {
//   pay_method : 'card',
//       merchant_uid: 'mid_' + new Date().getTime(),
//       name : '주문명:결제테스트',
//       amount : "1400",
//       app_scheme : 'ionickcp',
//       buyer_email : 'iamport@siot.do',
//       buyer_name : '구매자이름',
//       buyer_tel : '010-1234-5678',
//       buyer_addr : '서울특별시 강남구 삼성동',
//       buyer_postcode : '123-456'
//     };
//     const param = {
//       pay_method : 'card',
//       merchant_uid : 'merchant_' + new Date().getTime(),
//       name : '주문명:결제테스트',
//       amount : 1400,
//       buyer_email : 'iamport@siot.do',
//       buyer_name : '구매자이름',
//       buyer_tel : '010-1234-5678',
//       buyer_addr : '서울특별시 강남구 삼성동',
//       buyer_postcode : '123-456'
//     };

//     var PaymentObject={
//       userCode: "imp58611631",
//       data: data,
//       callback:function(response) { alert(JSON.stringify(response)); },   
//     }
        
    
//     // 아임포트 관리자 페이지 가입 후 발급된 가맹점 식별코드를 사용
//     IamportCordova.payment(PaymentObject )
//       .then((response)=> {
//         alert("success")
//         alert(JSON.stringify(response))
//       })
//       .catch((err)=> {
//         alert(err)
//       })
//     ;

  }

}
