import { Component, NgZone, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, ModalController, LoadingController ,MenuController} from 'ionic-angular';
import firebase from 'firebase/app';
import {LoginpagePage} from '../loginpage/loginpage'
import { GameDetailPage } from '../game-detail/game-detail';
import * as $ from 'jquery';
import { DepositPage } from '../deposit/deposit';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { PeripheralPage } from '../peripheral/peripheral';
import { DiscountPage } from '../discount/discount';
import { ConfirmPage } from '../confirm/confirm';


import { AppVersion } from '@ionic-native/app-version/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
/**
 * Generated class for the TspagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-tspage',
  templateUrl: 'tspage.html',
})
export class TspagePage {
  id:any;
  @ViewChild('modeSlide') slides: Slides;
  @ViewChild('gameSlide') gslides:Slides;
  lloading:any;

  menu_flag=false;

  search_flag = false;
  image_flag = false;
  all_data:any;
  gamearray:any;
  hardwarearray:any;
  peripheralarray = [];
  count=0;
  search_str='';

  hardware_slide:any;

  console_flag=false;
  console_flag2=false;
  peri_flag=false;
  peri_flag2=false;

  game_slide:any;
  gslide_num:any;

  sale_data:any;
  admin:any;

  select_list:any;
  select_num:any;

  init_flag=false;

  user:any;
  diff:any;
  startDate:any;
  endDate:any;
  startDate_text:any;
  endDate_text:any;
  tomorrowflag:any;

  tick=0;
  game:any;
  hardware:any;
  peripheral=[];
  contrast=0;

  gametotalprice=0;
  consoletotalprice=0;
  peripheraltotalprice=0;
  totalprice=0;
  coinprice=0;

  coins: any;
  totalcoins:any;
  totalpaymoney = 0;
  hwborrow : any;

  payment_flag=false;
  version:any;

  firemain = firebase.database().ref();
  constructor(private iab: InAppBrowser,public modal:ModalController, public alertCtrl:AlertController,public oneSignal:OneSignal
  ,public zone: NgZone,public navCtrl: NavController, public navParams: NavParams,public loading:LoadingController,public appVersion:AppVersion
  ,public datePicker:DatePicker,private menu: MenuController) {

    var loginflag=localStorage.getItem('loginflag');
    if(loginflag!=''&&loginflag!='false'&&loginflag!=undefined&&loginflag!=null){
      var id=localStorage.getItem('id');
      this.firemain.child('users').child(id).once('value').then((snap)=>{
        this.user=snap.val();
        console.log(this.user);
      })
    }

    this.loading_on();
    // this.sideMenu();

    //version check

    this.firemain.child("setting").once("value", (snapshot) => {
      for (var a in snapshot.val()) {
        if (a == "version") {
          this.version = snapshot.val()[a];
        }
        console.log(snapshot.val()[a]);
      }

      var versionnumber = "";
      setTimeout(()=>{
        this.OneSignalInstall();
      },100)
      this.appVersion.getVersionNumber().then(version => {
        versionnumber = version;
        //0.2 3
        if (Number(this.version) > Number(versionnumber)) {
          window.alert("앱을 업데이트 해주세요!")
          var market_url = "market://details?id=io.ionic.onofflab.bilim";
          this.iab.create(market_url,"_blank")

          

        }
      });
    })
    var now = new Date();

    var tomorrow = new Date();
    tomorrow.setDate(now.getDate()+1);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var datee = now.getDate();
    var hour = now.getHours();
    var min = now.getMinutes();
    var nnow = year + "-" + month + "-" + datee + " " + hour + ":" + min;
    console.log(nnow);
    console.log(tomorrow);
    if(hour<9){
      this.startDate=now.toISOString();
      // this.delivery_time="오늘("+now.getDate()+"일) 오전 9시~11시 " ;
      this.tomorrowflag=false; 
    }
    else if(hour>=9&&hour<13){
      // this.delivery_time=" 오늘("+now.getDate()+"일) 오후 3시~5시 ";
      this.tomorrowflag=false; 
      this.startDate=now.toISOString();
    }
    else{
      this.tomorrowflag=true;
      // this.delivery_time="내일("+tomorrow.getDate()+"일) 오전 9시~ 11시 "
      this.startDate=tomorrow.toISOString();
    }
    this.startDate_text=((tomorrow.getFullYear())+'-'+(tomorrow.getMonth()+1)+'-'+tomorrow.getDate());

    console.log(this.startDate_text+"zzzz")

    var date = new Date(this.startDate);
    date.setDate(date.getDate() + 2);

    this.endDate=date.toISOString();
    this.endDate_text=(date.getFullYear())+'-'+(date.getMonth()+1)+'-'+(date.getDate());

    this.datechange(1);
    this.datechange(2);

    console.log(this.startDate);
    console.log(this.endDate);

    this.payment_ready();

    // this.user = this.navParams.get("user");
    this.select_list=[{}];
    this.select_list[0]={name:'닌텐도 스위치',key:'switch'};
    this.select_list[1]={name:'플레이 스테이션',key:'ps'};
    this.select_num=0;
    this.gslide_num=0;
    console.log(this.select_list)

    this.gamearray=[{}];

    this.firemain.child('category')
    .once('value').then((snap)=>{
      console.log(snap.val())
      // this.all_data=snap.val();
      this.all_data={switch:{software:[],hardware:[]},ps:{software:[],hardware:[]},}
      
      var cnt=0;
      this.all_data.switch.hardware=[];
      for(var i in snap.val().switch.hardware)
        this.all_data.switch.hardware[cnt++]=snap.val().switch.hardware[i];

      cnt=0;
      this.all_data.switch.software=[];
      for(var i in snap.val().switch.software)
        this.all_data.switch.software[cnt++]=snap.val().switch.software[i];
      
      cnt=0;
      this.all_data.ps.hardware=[];
      for(var i in snap.val().ps.hardware)
        this.all_data.ps.hardware[cnt++]=snap.val().ps.hardware[i];
      
      cnt=0;
      this.all_data.ps.software=[];
      for(var i in snap.val().ps.software)
        this.all_data.ps.software[cnt++]=snap.val().ps.software[i];
      console.log(this.all_data)
      this.game_sort();
      this.generatehardware()
      this.game_init()
      setTimeout(() => {
        this.init_flag=true;
        this.loading_off();
      }, 100);
    })
  }
  search_area(){
    this.search_flag = true;
    this.image_flag =! this.image_flag;
    if(this.image_flag == false){
      setTimeout(()=>{
        this.search_flag = false;
      },1000);
    }
    console.log("flag1 :"+this.image_flag);
    console.log("search : "+this.search_flag);
  }

  OneSignalInstall() {
    this.oneSignal.startInit('6505b348-1705-4d73-abe4-55ab40758266');
    console.log("onesignal-2-2");
    // this.oneSignal.clearOneSignalNotifications();
    console.log("onesignal 00");
    var iosSettings = {
      "kOSSettingsKeyAutoPrompt": true,
      "kOSSettingsKeyInAppLaunchURL": true
    };
    console.log("onesignal 11");
    this.oneSignal.iOSSettings(iosSettings);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    console.log("onesignal 22");
    console.log("onesiganl get id startedddddd")

    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      console.log("received data");
      console.log(data);
      var welcome=data.notification.payload.title;
    })
    this.oneSignal.getIds().then(data => {
      console.log(data);
      console.log("get id success" + data.userId)
      if (this.id != null && this.id != undefined) {
        this.firemain.child("users").child(this.id).update({ "deviceId": data.userId })
        localStorage.setItem("tokenvalue", data.userId);
      }


    }).catch((e) => {
      // window.alert("onesignal error"+e);
      console.log("onesignal error : " + e);
    })
    this.oneSignal.endInit();
  }
  datecheck(mode,date):boolean{
    var t=new Date();
    var t2=new Date(date);
    t.setHours(1);
    t.setMinutes(0);
    t.setSeconds(0);
    t2.setHours(1);
    t2.setMinutes(0);
    t2.setSeconds(0);
    var a=t.getTime()-t2.getTime();
    console.log(a);
    if(mode===1&&t.getHours()>14&&t.getDate()===t2.getDate()){
      this.confirmAlert2("오후 2시 이전 주문시만 당일 주문 가능합니다.")
      return false;
    }
    if(a/(1000*3600*24)>0){
      console.log(a/(1000*3600*24))
      if(mode===1) this.confirmAlert2("대여일이 오늘보다 빠를수는 없습니다.")
      else this.confirmAlert2("반납일이 오늘보다 빠를수는 없습니다.")
      return false
    }
    else return true;
  }

  datechange(mode){
    console.log(this.startDate);
    console.log(this.startDate_text)
    console.log(this.endDate)
    console.log(this.endDate_text)
    var a = new Date(this.startDate);
    var b = new Date(this.endDate);
    var c = new Date();

    c.setTime(0);
    c.setFullYear(a.getFullYear());
    c.setMonth(a.getMonth());
    c.setDate(a.getDate());
    a=new Date(c);

    c.setFullYear(b.getFullYear());
    c.setMonth(b.getMonth());
    c.setDate(b.getDate());
    b=new Date(c);

    console.log(a);
    console.log(b);
    var diff=a.getTime()-b.getTime();
    var Difference_In_Days = diff / (1000 * 3600 * 24);
    diff=Difference_In_Days
    console.log(diff)
    diff=Math.floor(diff);
    // Difference_In_Days=diff;
    diff=Math.abs(diff);
    this.diff=diff+1;
    console.log(this.diff)
    if(Difference_In_Days>=0){
      if(mode===1){
        this.confirmAlert2("대여 시작일이 반납일보다 늦을 수는 없습니다.")
        a=new Date();
        if(this.tomorrowflag===true) a.setDate(a.getDate()+1);
        this.startDate=a.toISOString();
        this.startDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
      }
      else {
        this.confirmAlert2("반납일이 대여 시작일보다 빠를 수는 없습니다.")
        a=new Date(this.startDate);
        if(this.tomorrowflag===true) a.setDate(a.getDate()+1);
        a.setDate(a.getDate()+2);
        this.endDate=a.toISOString();
        this.endDate_text=(a.getFullYear())+"-"+(a.getMonth()+1)+"-"+(a.getDate());
      }
      this.datechange(mode)
    }
    else{
      if(Difference_In_Days>-2){
        this.confirmAlert2("최소 대여기간은 3일 입니다.")
        if(mode===1){
          a=new Date();
          if(this.tomorrowflag===true) a.setDate(a.getDate()+1);
          // b=new Date(this.endDate);
          // a.setDate(a.getDate()+2);
          this.startDate=a.toISOString();
          this.startDate_text=(a.getFullYear())+"-"+(a.getMonth()+1)+"-"+(a.getDate());
        }
        else{
          a=new Date(this.startDate);
          // if(this.tomorrowflag===true) a.setDate(a.getDate()+1);
          a.setDate(a.getDate()+2);
          this.endDate=a.toISOString();
          this.endDate_text=(a.getFullYear())+"-"+(a.getMonth()+1)+"-"+(a.getDate());
        }
        this.datechange(mode);
      }
      else if(Difference_In_Days<-179){
        this.confirmAlert2("최대 대여기간은 180일 입니다.")
        a=new Date(this.startDate);
        a.setDate(a.getDate()+179);
        this.endDate=a.toISOString();
        this.endDate_text=(a.getFullYear())+"-"+(a.getMonth()+1)+"-"+(a.getDate());
        this.datechange(mode);
      }
      else{
        if(mode===1){
          a = new Date(this.startDate);
          this.startDate=a.toISOString();
          this.startDate_text=(a.getFullYear())+"-"+(a.getMonth()+1)+"-"+(a.getDate());
        }
        else{
          b = new Date(this.endDate);
          this.endDate=b.toISOString();
          this.endDate_text=(b.getFullYear())+"-"+(b.getMonth()+1)+ "-"+(b.getDate());
        }
        this.totalcalculator(0);
      }
    }
    console.log(this.startDate)
    console.log(this.startDate_text)
    console.log(this.endDate)
    console.log(this.endDate_text)
  }

  pick_date(mode){
    var temp:any;
    if(mode===1) temp=new Date(this.startDate);
    else if(mode===2) temp=new Date(this.endDate);
    temp.setHours(1);
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

  //보증금, hardware:선택한 기기
  tick_ready(hardware){
    for(var sd in this.sale_data.ticknumber){
      if(Number(hardware.pricenormal)===Number(sd)){
        this.tick=Number(this.sale_data.ticknumber[sd]);
      }
    }
  }

  payment_ready(){

    var flag=false;
    this.firemain.child('sale_data').once('value').then((snap)=>{
      this.sale_data=snap.val();
      console.log(this.sale_data)
      this.payment_flag=flag;
      flag=true;
    })
    this.firemain.child('admin').once('value').then((snap)=>{
      this.admin=snap.val();
      console.log(this.admin)
      this.payment_flag=flag;
      flag=true;
    })
    // if(this.user.point===undefined) this.user.point="10";
  }

  totalcalculator(n){
    console.log(n);
    if(n===1) this.gamecalculation();
    else if(n===2)this.consolecalculation();
    else if(n===3) this.peripheralcalculator();
    this.totalprice=this.gametotalprice+this.consoletotalprice+this.peripheraltotalprice;
    this.totalprice*=this.diff;
    this.totalprice-=this.coinprice;
  }

  gamecalculation(){
    var gameprice=0;
    this.gametotalprice=0;

    console.log(this.game);
    for (var i in this.game) {
      // if (this.hardware != undefined) {
      //   gameprice=this.game[i].price*((100-Number(this.sale_data.percentage.console.split('%')[0]))/100);
      // }
      gameprice=this.game[i].price;
      this.gametotalprice += Number(gameprice);
    }
    console.log(this.gametotalprice)
  }

  consolecalculation(){
    var diff=Number(this.diff)
    var percent_date=this.sale_data.percentage.date;
    var flag=false;
    this.consoletotalprice=0;

    this.hardware.pricedaily=Number(this.sale_data.deposit[this.hardware.name][this.contrast]);

    // for(var date in percent_date){
    //   if(date.split('~')[0]==='0') continue;
    //   else if(date.split('~')[1]==='0') flag=true;
    //   else flag=false;

    //   if(diff>percent_date[date].split('~')[0]&&(diff<percent_date[date].split('~')[1]||flag===true)){
    //     this.hardware.pricedaily=(100-(Number(this.sale_data.percentage.date.split('~')[0]))/100);
    //     break;
    //   }
    // }
    this.consoletotalprice=Number(this.hardware.pricedaily);
  }

  peripheralcalculator(){
    var periprice=0;
    this.peripheraltotalprice=0;
      console.log(this.peripheral);
      for (var i in this.peripheral) {
        if(this.peripheral[i]===undefined) continue;
        periprice=this.peripheral[i].pricedaily;
        this.peripheraltotalprice += Number(periprice);
      }
      console.log(this.peripheraltotalprice)

  }
  console_checkbox(){
    console.log(this.console_flag)
    console.log(this.count);
    if(this.count==0){
      this.console_flag = false;
      this.console_flag2 = false;
      this.confirmAlert2('게임을 선택해야 게임기를 대여할 수 있습니다.');
    }else{

    if(this.console_flag===true){
      let modal = this.modal.create(DepositPage,{hardware:this.hardwarearray,sale:this.sale_data},{ cssClass: 'deposit-modal' });
      modal.onDidDismiss(data => {
        console.log(data)
        this.hwborrow = data;
        if(data!=null&&data.hd!=undefined){
          this.console_flag2=true;
          this.hardware=data.hd;
          this.contrast=data.ct;
          this.totalcalculator(2);
          console.log(this.hwborrow);
        }
        else{
          this.console_flag=this.console_flag2;
        }
      });
      modal.present();
    }
    else{
      this.console_flag2=false;
      this.hardware=undefined;
      this.consoletotalprice=0;
      this.contrast=0;
      this.totalcalculator(0);
    }
          
  }
    // this.slides.lockSwipes(!this.console_flag);
  }
  peri_checkbox(){
    console.log(this.peri_flag)

    if(this.peri_flag===true){
      console.log(this.peripheralarray)
      let modal:any;
      if(this.select_num===0){
        modal = this.modal.create(PeripheralPage,{peripheral:this.peripheralarray},{ cssClass: 'peri-modal1' });
      }
      else if(this.select_num===1){
        modal = this.modal.create(PeripheralPage,{peripheral:this.peripheralarray},{ cssClass: 'peri-modal2' });
      }
      
      modal.onDidDismiss(data => {
        console.log(data)
        if(data!=null&&data.pp!=undefined){
          this.peri_flag2=true;
          this.peripheral=data.pp;
          this.totalcalculator(3);
        }
        else{
          this.peri_flag=this.peri_flag2;

        }
      });
      modal.present();
    }
    else{
      this.peri_flag=false;
      this.peri_flag2=false;
      this.peripheral=undefined;
      this.peripheraltotalprice=0;
      this.totalcalculator(0);

    }
  }

  select_reset(){
    var data:any;
    var n=this.select_num

    if(n==1) data=this.all_data.switch.software;
    else if(n==0) data=this.all_data.ps.software;

    for(var i in data){
      data[i].fflag=false;
    }
    
    if(n==1) this.all_data.switch.software=data;
    else if(n==0) this.all_data.ps.software=data;

    this.count=0;
    this.totalprice=0;
    this.gametotalprice=0;
    this.consoletotalprice=0;
    this.peripheraltotalprice=0;
    this.totalcalculator(0);
  }

  slideChanged(){
    if(this.init_flag===true){
      this.loading_on();
      this.init_flag=false;
      console.log(this.slides.getActiveIndex())
      this.select_num = this.slides.getActiveIndex();
      console.log(this.select_num);
      if(this.select_num % 2 == 0){
        $(".slidenintendo").css("color","#70c5ed");
        $(".slideps").css("color","#d3d3d3");
      }else if(this.select_num % 2 == 1){
        $(".slideps").css("color","#70c5ed");
        $(".slidenintendo").css("color","#d3d3d3");
      }

      this.gslides.centeredSlides=false;
      console.log('false');

      // this.gslide_reset();

      this.console_flag=false;
      this.peri_flag=false;

      this.select_num%=2
  
      this.search_str='';
      console.log(this.select_num)
      this.select_reset()
      this.generatehardware();
      this.game_init();
      setTimeout(() => {
        // this.gslide_reset();
        this.init_flag=true;
        this.loading_off();
      }, 100);
    }
  }

  slideChanged2(){
    // this.gslides.slideTo(0);
    // this.gslide_num=3;
    this.gslide_num = this.gslides.getActiveIndex();
    this.gslide_num%=this.game_slide.length;
    if(this.gslide_num===0||this.gslide_num+2===(this.game_slide.length)){
      console.log('false');
      this.gslides.centeredSlides=false;
      // this.gslide_num=this.game_slide.length-2;
      // this.gslide_num=1;
    }
    else{
      console.log('true');
      this.gslides.centeredSlides=true;
    }
    this.gslides.slideTo(this.gslide_num);
    // this.ctck()
    console.log(this.gslide_num)
  }

  game_init(str:string=''){
    var num=this.select_num;
    var Data:any;
    if(num===0){
      Data=this.all_data.switch;
      console.log('switch');
    }
    else{
      Data=this.all_data.ps;
      console.log('ps')
    }
    console.log(Data);
    this.gamearray=[];

    var cnt=0;
    for(var i in Data.software){
      if(str!=''&&str!=undefined){
        var temp=Data.software[i].name.split('\n')[0]
        +' '+
        Data.software[i].name.split('\n')[1];
        console.log('search : ',str)
        if(temp.indexOf(str)!=-1){
          this.gamearray[cnt++]=Data.software[i];
        }
      }
      else{
        this.gamearray=Data.software;
        break;
      }
    }
    cnt=0;
    console.log(this.gamearray);
    // this.game_sort(num);
    this.push_slide()
    // this.init_flag=true;
  }

  push_slide(){
    var game_slide2=[];
    this.game_slide=[];

    var num=this.gamearray.length;
    var lmt=Math.floor(num/6)*6+(num%6);
    console.log(this.gamearray);
    console.log(num)
    console.log(lmt)

    // for(var i=Math.floor(lmt/2);i>0;i--){
    //   game_slide2[i]=[];

    //   if(num>(i*2)){
    //     game_slide2[i][0]=this.gamearray[(i*2)];
    //     game_slide2[i][0].num=(i*2);
    //   }

    //   if(num>(i*2+1)){
    //     game_slide2[i][1]=this.gamearray[(i*2)+1];
    //     game_slide2[i][1].num=(i*2)+1;
    //   }
    // }

    for(var i=0;i<lmt/2;i++){
      game_slide2[i]=[];
      // for(var j=0;j<6;j+=2){
        if(num<=(i*2)) break;
        game_slide2[i][0]=this.gamearray[(i*2)];
        game_slide2[i][0].num=(i*2);

        if(num<=(i*2)+1) break;
        game_slide2[i][1]=this.gamearray[(i*2)+1];
        game_slide2[i][1].num=(i*2)+1;
      // }
    }
    this.game_slide=game_slide2;
    console.log(this.game_slide)
  }

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
  }
  
  game_sort(){
    var temp:any;
    var num:any;
    var Data;
    for(var m=0;m<2;m++){
      if(m===0) console.log('switch');
      else console.log('ps');

      if(m===0) Data=this.all_data.switch.software;
      else Data=this.all_data.ps.software;
  
      console.log(Data);
      console.log('sort_start')
      for(var q=0;q<Data.length;q++){
        Data[q].name=String(Data[q].name);
  
        if(Data[q].name.substring(0,1)==='!'){
  
          num=Data[q].name.length;
          Data[q].name=Data[q].name.substring(1,num);
          continue;
        }
        for(var w=q+1;w<Data.length;w++){
          if(Data[w].name.substring(0,1)==='!'){
  
            num=Data[w].name.length;
            Data[w].name=Data[w].name.substring(1,num);
  
            temp=Data[q];
            Data[q]=Data[w];
            Data[w]=temp;
            break;
          }
        }
      }
      if(m===0) this.all_data.switch.software=Data;
      else this.all_data.ps.software=Data;
    }
    
    console.log(this.all_data)
  }

  gameselected(v,i){
    this.zone.run(()=>{
      console.log(this.gamearray[i]);
      console.log(this.gamearray[i].fflag)
      if(Number(this.gamearray[i].stock)<=0){
        var date=undefined;
        
        if(this.gamearray[i].near_return_date!=undefined){
          date=new Date(this.gamearray[i].near_return_date);
          console.log(date)
          this.confirmAlert2('재고가 없는 게임입니다.<br> 반납 예정일 '+(date.getMonth()+1)+'월 '+date.getDate()+'일')
        }
        else{
          this.confirmAlert2('재고가 없는 게임입니다.');
        }
      }
      else{
        this.count=0;
        this.game=[];
        
        this.gamearray[i].fflag=!this.gamearray[i].fflag;
        console.log(this.gamearray);
        for(var j=0; j<this.gamearray.length; j++){
          if(this.gamearray[j].fflag==true){
            this.game[this.count]=this.gamearray[j];
            this.count++;
          }
        }
        if(this.count>3){
          this.confirmAlert2("이 이상은 '밍' 할수 없습니다.")
          this.gamearray[i].fflag=false;
        }
        console.log("count is : "+this.count);
        if(this.count == 0){
          this.console_flag = false;
          this.peri_flag = false;
        }
      }
      this.totalcalculator(1);
    })
  }

  gotogamedetail(game){
    const browser = this.iab.create('https://store.nintendo.co.kr/70010000024287',"_blank","location=no,toolbar=no");

    // browser.on('loadstop').subscribe(event => {
    //   browser.insertCSS({ code: "body{color: red;" });
    // });

    browser.close();
  }

  new_check(g):boolean{

    // console.log(g);
    var game=String(g.description.open_date);

    var newflag=false;
    var date=new Date();
    var open=new Date();
    open.setFullYear(Number(game.split('.')[0]));
    open.setMonth(Number(game.split('.')[1])-1);
    open.setDate(Number(game.split('.')[2]));
    date.setDate(date.getDate()-45)


    if(
      (date.getFullYear()<open.getFullYear())||
      (date.getFullYear()===open.getFullYear()&&date.getMonth()<open.getMonth())||
      (date.getFullYear()==open.getFullYear()&&date.getMonth()===open.getMonth()&&date.getDate()<open.getDate())){
        console.log(g);
        console.log(date)
        console.log(open+'\n');    
        console.log('true')
        return true;
    }
    else return false;
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

  change_category(n){
    console.log(this.slides.getActiveIndex())
    if(n>0) this.slides.slideNext();
    else this.slides.slidePrev();
    console.log(this.slides.getActiveIndex())
  }

  generatehardware() {
    this.hardwarearray=[];
    this.peripheralarray=[];
    this.firemain.child("category").child(this.select_list[this.select_num].key)
    .once("value").then((snapshot) => {
      for (var b in snapshot.val().hardware) {
        if (this.hardwarearray.length === 0) {
          this.hardwarearray=[];
          console.log(snapshot.val().hardware[b])
          this.hardwarearray.push(snapshot.val().hardware[b]);
        }
        console.log(this.hardwarearray)

        for (var i = 0; i < this.hardwarearray.length; i++) {
          console.log(this.hardwarearray[i]);
          if (this.hardwarearray[i].itemcode.substring(8, 10)
          === snapshot.val().hardware[b].itemcode.substring(8, 10)) {
            this.hardwarearray[i].stock =
            Number(this.hardwarearray[i].stock)+Number(snapshot.val().hardware[b].stock);
            break;
          }
          else if (i === this.hardwarearray.length - 1) {
            console.log(snapshot.val().hardware[b])
            this.hardwarearray.push(snapshot.val().hardware[b]);
          }
        }
      }
        
      for (var j in this.hardwarearray) {
        if (Number(this.hardwarearray[j].stock) <= 0) {
          this.hardwarearray[j].name += "[일시품절]"
          console.log(this.hardwarearray[j].name);
        }
      }
  
      for (var peri in snapshot.val().peripheral) {
        console.log(peri);
        console.log(snapshot.val().peripheral[peri]);
        this.peripheralarray.push(snapshot.val().peripheral[peri]);
      }

      this.hardware_slide=[{}]
      for(var hw in this.hardwarearray){
        this.hardware_slide[hw]={name:this.hardwarearray[hw].name};
      }
      console.log(this.hardware_slide)
      console.log(this.hardwarearray);
      console.log(this.peripheralarray);
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
    this.lloading.dismiss()
  }

  // gslide_reset(){
  //   var i = setInterval(()=>{
  //     if(this.gslides!=undefined&&this.init_flag===true&&
  //     this.gslides.getActiveIndex()!=1){
  //       clearInterval(i);
  //       setTimeout(() => {
  //         this.gslides.slideTo(1);
  //         this.gslide_num=1;
  //       }, 500);
  //     }
  //   },10)
  // }

  discount(){
    console.log('discount');
    this.totalcalculator(0);
    let modal = this.modal.create(DiscountPage,{"user":this.user,'sale':this.sale_data.coin.price,'price':this.totalprice+this.contrast},{ cssClass: 'discount-modal'});
    modal.onDidDismiss(data => {
      console.log(data);
      if(data!=null&&data.coinprice!=undefined){
        this.user.point=data.coin;
        this.coinprice=data.coinprice;
        this.totalcalculator(0);
      }
      console.log(this.totalpaymoney);
    });
    modal.present();
  }
  goConfirm(){
    let modal = this.modal.create(ConfirmPage,{"user":this.user, "price":this.totalprice+this.contrast, "game":this.game, "hw":this.hwborrow, "peri":this.peripheral, "gameprice":this.totalprice, "contrast":this.contrast},{ cssClass: 'confirm-modal'});
    modal.onDidDismiss(data => {
      console.log(data);
    });
    modal.present();
  }

  searching(str){
    console.log(str)
    // this.loading_on();
    this.game_init(str);
    setTimeout(() => {
      this.gslides.slideTo(0);
    }, 500);
    // this.loading_off();
  }

  ionViewDidLoad() {
    // this.ctck()
    // this.gslide_reset();
    console.log('ionViewDidLoad TspagePage');
    $("#searchbox").on("change keyup paste",()=>{
      this.searching(this.search_str);
    })
    // $("#searchbox").on("propertychange change keyup paste input",()=>{
    //   this.gslides.slideTo(0);
    //   // var currentVal = $(this).val();
    //   var currentVal=this.search_str;

    //   console.log(currentVal)
    //   this.loading_on();
    //   this.game_init(currentVal);
    //   this.loading_off();
    //   console.log("changed!");
    // });
  }
}