
import { Component,NgZone } from '@angular/core';
import { IonicPage,App, ModalController,ModalOptions,AlertController,ViewController,NavController,Events, NavParams, Platform } from 'ionic-angular';

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
 * 
 * 14일 30%
 * 30일 50%
 * 관리자 상태 추가 (검수완료)
 */

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  sale_data:any;
  detail:any;
  arraying=[];
  mainimage:any;
  descriptionimage=[];
  firstshow:any=true;
  thirdshow:any=false;
  secondshow:any=false;
  fourthshow:any=false;
  today=new Date();
  count=0;
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
  loginflag:any="false";
  diff:any;
  maker:any;
  startDate:any= new Date().toISOString();
  user:any;

  font_size=[];
  logRatingChange(v){
    console.log(v)
  }

  datecheck(mode,date):boolean{
    
    var a=new Date().getTime()-new Date(date).getTime();
    console.log(a);

    if(a/(1000*3600*24)>0){
      console.log(a/(1000*3600*24))
      
      if(mode===1) this.confirmAlert2('대여일이 오늘보다 빠를수는 없습니다.')
      else this.confirmAlert2('반납일이 오늘보다 빠를수는 없습니다.')

      return false
    }
    else return true;
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
    this.diff=diff+1;
    console.log(this.diff)

    // this.diff=this.diff+1;
    if(Difference_In_Days>0){
      if(mode===1){
        this.confirmAlert2("대여 시작일이 반납일보다 늦을 수는 없습니다.")
        var a=new Date();
        this.startDate=a.toISOString();
        this.startDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
      }
      else {
        this.confirmAlert2("반납일이 대여 시작일보다 빠를 수는 없습니다.")
        var a=new Date(this.startDate);
        a.setDate(a.getDate()+2);
        this.endDate=a.toISOString();
        this.endDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
      }
      this.datechange(mode)
    }
    else{
      if(mode===1){
        this.startDate=a.toISOString();
        this.startDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
      }
      else {

        if(Difference_In_Days>-2){
          this.confirmAlert2("최소 대여기간은 3일 입니다.")
          var a=new Date(this.startDate);
          a.setDate(a.getDate()+2);
          this.endDate=a.toISOString();
          this.endDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
        }
        else{
          this.endDate=b.toISOString();
          this.endDate_text=(b.getFullYear())+'-'+(b.getMonth()+1)+'-'+(b.getDate());
        }
      }
    }
  }

  pick_date(mode){
    var temp:any;
    // var date=new Date();
    // date.setDate(new Date().getDate()-1)
    // this.startDate=date;
    // console.log(this.startDate);
    // if(this.datecheck()===true){
    //   this.datechange(mode);
    // }
    if(mode===1) temp=new Date(this.startDate);
    else if(mode===2) temp=new Date(this.endDate);
    this.datePicker.show({
      date: temp,
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
    }).then(
      date =>{
        console.log('Got date: ', date);
        if(this.datecheck(mode,date)===true){
          if(mode===1) this.startDate=date;
          else if(mode===2) this.endDate=date;
          this.datechange(mode);
        }
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }
  gotologin(){
    this.navCtrl.push(LoginpagePage)
  }
  constructor(public zone: NgZone,public app:App,public inapp:InAppBrowser,public modal:ModalController,public alertCtrl:AlertController,public view:ViewController, public events: Events,public datePicker:DatePicker,public navCtrl: NavController, public navParams: NavParams,public platform:Platform) {
    this.detail=navParams.get("a")
    this.user=navParams.get("user");
    this.sale_data=navParams.get("sale");

    console.log(this.sale_data)

    this.loginflag=localStorage.getItem("loginflag");
    console.log("user is : "+this.user);
   console.log(this.detail);
    var date = new Date();

    let backAction =  platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    },2)

    this.startDate=date.toISOString();
    this.startDate_text=(date.getFullYear())+'-'+(date.getMonth()+1)+'-'+(date.getDate());

    date.setDate(date.getDate() + 2);

    this.endDate=date.toISOString();
    this.endDate_text=(date.getFullYear())+'-'+(date.getMonth()+1)+'-'+(date.getDate());

      this.datechange(1);
      this.datechange(2);

    console.log(this.startDate);
    console.log(this.endDate);

    // var startDate2=new Date();
    // console.log(date);
    // console.log(startDate2)
    // var diff=date.getTime()-startDate2.getTime();

    // var Difference_In_Days = diff / (1000 * 3600 * 24); 
    // var diff=Difference_In_Days;
    // this.diff=Math.ceil(diff)
    // console.log(this.diff);
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
    this.length_check();
  }

  length_check(){
    for(var q in this.gamearray){
      var n=0;
      console.log(this.gamearray[q].name)
      for(var w=0;w<this.gamearray[q].name.length;w++){
        if(this.gamearray[q].name[w]>='A'&&this.gamearray[q].name[w]<='Z'){
          n+=1;
        }
        else if(this.gamearray[q].name[w]>='a'&&this.gamearray[q].name[w]<='z'){
          n+=1;
        }
        else if(this.gamearray[q].name[w]>='0'&&this.gamearray[q].name[w]<='9'){
          n+=1;
        }
        else if(this.gamearray[q].name[w]===' '){
          n+=1;
        }
        else n+=1.5;
      }
      this.gamearray[q].font_size=n;
      console.log(this.gamearray[q].font_size)
    }
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
    this.zone.run(()=>{

      if(Number(this.gamearray[i].stock)<=0){
        this.confirmAlert2('재고가 없는 게임입니다.')
      }
      else if(this.gamearray[i].check===false&&this.count>=3){
        this.confirmAlert2("이 이상은 '밍' 할수 없습니다.")
      }
      else{
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
    })
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

  confirmAlert2(str) {
    let alert = this.alertCtrl.create({      
        subTitle: str,
        buttons: [  
        {
          text: '확인',
        }],
        cssClass: 'alertDanger'
    });
    alert.present({animate:true});
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
    this.count=0;
    console.log(this.detail);
    console.log(this.gamearray);
    for(var j=0; j<this.gamearray.length; j++){
      if(this.gamearray[j].fflag==true){
        this.count++;
      }
    }
    console.log(this.count);
    console.log(this.gamearray);
    console.log(this.diff);
    var a = localStorage.getItem("loginflag");
    console.log(a);
    if(a=="false"||a==null){
      this.confirmAlert("로그인이 필요한 서비스입니다.\n 로그인 페이지로 이동하시겠습니까?");
    }
    else if(this.count===0){
      this.confirmAlert2('1가지 이상의 게임을 선택해주세요.')
    }
    // else if(this.count>6){
    //   let modal = this.modal.create(ModalpagePage,{"user":this.user,"startDate":this.startDate,"endDate":this.endDate,"diff":this.diff,"list":this.gamearray,"flag":this.detail,"set":this.setdata},{ cssClass: 'test-modal3' });
    //   modal.onDidDismiss(data => {
    //     if(data!=undefined){
    //       console.log(data);
  
    //       // this.uploadImageToFirebase(data);
    //     }
        
    //   });
    //   modal.present();
    // }
    // else if(this.count>3){
    //   let modal = this.modal.create(ModalpagePage,{"user":this.user,"startDate":this.startDate,"endDate":this.endDate,"diff":this.diff,"list":this.gamearray,"flag":this.detail},{ cssClass: 'test-modal2' });
    //   modal.onDidDismiss(data => {
    //     if(data!=undefined){
    //       console.log(data);
  
    //       // this.uploadImageToFirebase(data);
    //     }
        
    //   });
    //   modal.present();
    // }
    else{
      // window.alert("less than 3")
      var modaloption : ModalOptions={
        enableBackdropDismiss:true
      }
      let modal = this.modal.create(ModalpagePage,{"user":this.user,"startDate":this.startDate,"endDate":this.endDate,"diff":this.diff,"list":this.gamearray,"flag":this.detail,"sale":this.sale_data},{ cssClass: 'test-modal1' });
      modal.onDidDismiss(imagedata => {
        console.log(imagedata)
      });
      modal.present();
    }
  }
}
      // this.navCtrl.push(OrderpagePage)



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