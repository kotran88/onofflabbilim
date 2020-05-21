import { Component, NgZone, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, ModalController } from 'ionic-angular';
import firebase from 'firebase/app';
import {LoginpagePage} from '../loginpage/loginpage'
import { GameDetailPage } from '../game-detail/game-detail';
import * as $ from 'jquery';
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
  @ViewChild('modeSlide') slides: Slides;
  @ViewChild('gameSlide') gslides:Slides;
  @ViewChild('consoleSlide') cslides:Slides;
  @ViewChild('periSlide0') pslides0:Slides;
  @ViewChild('periSlide1') pslides1:Slides;
  @ViewChild('periSlide2') pslides2:Slides;

  all_data:any;
  gamearray:any;
  hardwarearray:any;
  peripheral = [];
  count=0;
  search_str='';

  hardware_slide:any;

  console_flag=false;
  peri_flag=[false,false,false];

  game_slide:any;
  gslide_num:any;
  cslide_num:any;
  pslide_num=[0,0,0];

  select_list:any;
  select_num:any;

  init_flag:any;

  console_checkbox(){
    console.log(this.console_flag)
    // this.slides.lockSwipes(!this.console_flag);
  }
  peri_checkbox(n){
    console.log(n)
    console.log(this.peri_flag)
  }
  console_selectbox(){
    console.log(this.console_flag)
  }

  firemain = firebase.database().ref();
  constructor(private iab: InAppBrowser,public modal:ModalController, public alertCtrl:AlertController,public zone: NgZone,public navCtrl: NavController, public navParams: NavParams) {
    
    this.select_list=[{}];
    this.select_list[0]={name:'닌텐도 스위치',key:'switch'};
    this.select_list[1]={name:'플레이 스테이션',key:'ps'};
    this.select_num=0;
    this.gslide_num=0;
    this.cslide_num=0;
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
      this.generatehardware()
      this.game_init()
      this.init_flag=true;
    })
  }

  slideChanged(){
    if(this.init_flag===true){
      this.init_flag=false;
      console.log(this.slides.getActiveIndex())
      this.select_num = this.slides.getActiveIndex();
      this.gslides.slideTo(0);
      this.select_num%=2
      // this.select_num=1-this.select_num;
      this.gslide_num=0;
      this.search_str='';
      console.log(this.select_num)
      this.generatehardware();
      this.game_init();
      this.init_flag=true;
    }
  }

  slideChanged2(){
    this.gslide_num = this.gslides.getActiveIndex();
    console.log(this.gslide_num)
  }
  slideChanged3(){
    this.cslide_num = this.cslides.getActiveIndex();
    this.cslide_num%=2;
    console.log(this.cslide_num)
  }
  slideChanged4(n){
    if(n==0){this.pslide_num[n] = this.pslides0.getActiveIndex();}
    else if(n==1){this.pslide_num[n] = this.pslides1.getActiveIndex();}
    else if(n==2){this.pslide_num[n] = this.pslides2.getActiveIndex();}
    this.pslide_num[n]%=2;
    console.log(n);
    console.log(this.pslide_num)
  }

  game_init(str:string=''){
    var num=this.select_num;
    var Data:any;
    if(num===0){
      Data=this.all_data.switch;
      console.log('switch')
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
        console.log('search : ',str)
        if(Data.software[i].name.indexOf(str)!=-1){
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
    this.game_sort(num);
    this.push_slide()
    // this.init_flag=true;
  }

  push_slide(){
    this.game_slide=[];
    var num=this.gamearray.length;
    var lmt=Math.floor(num/6)*6+(num%6);
    console.log(this.gamearray);
    console.log(num)
    console.log(lmt)

    for(var i=0;i<lmt/2;i++){
      this.game_slide[i]=[];
      // for(var j=0;j<6;j+=2){
        if(num<=(i*2)) break;
        this.game_slide[i][0]=this.gamearray[(i*2)];
        this.game_slide[i][0].num=(i*2);

        if(num<=(i*2)+1) break;
        this.game_slide[i][1]=this.gamearray[(i*2)+1];
        this.game_slide[i][1].num=(i*2)+1;
      // }
    }
    console.log(this.game_slide)
  }

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return String(num).replace(regexp, ',');
  }
  
  game_sort(n){
    var temp:any;
    var num:any;
    console.log('sort_start')
    for(var q=0;q<this.gamearray.length;q++){
      this.gamearray[q].name=String(this.gamearray[q].name);

      if(this.gamearray[q].name.substring(0,1)==='!'){

        num=this.gamearray[q].name.length;
        this.gamearray[q].name=this.gamearray[q].name.substring(1,num);
        continue;
      }
      for(var w=q+1;w<this.gamearray.length;w++){
        if(this.gamearray[w].name.substring(0,1)==='!'){

          num=this.gamearray[w].name.length;
          this.gamearray[w].name=this.gamearray[w].name.substring(1,num);

          temp=this.gamearray[q];
          this.gamearray[q]=this.gamearray[w];
          this.gamearray[w]=temp;
          break;
        }
      }
    }
    if(this.search_str===''){
      if(n===0) this.all_data.switch.software=this.gamearray;
      else this.all_data.ps.software=this.gamearray;
    }
    console.log(this.all_data)
  }

  gameselected(v,i){
    this.zone.run(()=>{

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
      else if(this.gamearray[i].check===false&&this.count>=3){
        this.confirmAlert2("이 이상은 '밍' 할수 없습니다.")
      }
      else{
        this.count=0;
      
        this.gamearray[i].check=!this.gamearray[i].check;
        this.gamearray[i].fflag=!this.gamearray[i].fflag;
        console.log(this.gamearray);
        // if(this.gamearray[i].fflag==true){
        //   this.gamearray[i].fflag=false;
        // }else{
        //   this.gamearray[i].fflag=true;
        // }
        for(var j=0; j<this.gamearray.length; j++){
          if(this.gamearray[j].fflag==true){
            this.count++;
          }
        }
        console.log("count is : "+this.count);
      }
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

  change_peri(m,n){
    var temp_slides:any;
    if(m===0) {
      console.log(this.pslides0.getActiveIndex())
      if(n>0) this.pslides0.slideNext();
      else this.pslides0.slidePrev();
      console.log(this.pslides0.getActiveIndex())
    }
    else if(m===1){
      console.log(this.pslides1.getActiveIndex())
      if(n>0) this.pslides1.slideNext();
      else this.pslides1.slidePrev();
      console.log(this.pslides1.getActiveIndex())
    }
    else if(m===2){
      console.log(this.pslides2.getActiveIndex())
      if(n>0) this.pslides2.slideNext();
      else this.pslides2.slidePrev();
      console.log(this.pslides2.getActiveIndex())
    }
  }

  change_category(n){
    console.log(this.slides.getActiveIndex())
    if(n>0) this.slides.slideNext();
    else this.slides.slidePrev();
    console.log(this.slides.getActiveIndex())
    this.slideChanged();
  }

  change_console(n){
    console.log(this.cslides.getActiveIndex())
    if(n>0) this.cslides.slideNext();
    else this.cslides.slidePrev();
    console.log(this.cslides.getActiveIndex())
    // this.slideChanged3();
  }

  generatehardware() {
    this.hardwarearray=[];
    this.peripheral=[];
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
        this.peripheral.push(snapshot.val().peripheral[peri]);
      }

      this.hardware_slide=[{}]
      for(var hw in this.hardwarearray){
        this.hardware_slide[hw]={name:this.hardwarearray[hw].name};
      }
      console.log(this.hardware_slide)
      console.log(this.hardwarearray);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TspagePage');
//propertychange change keyup paste input

    // this.cslides.lockSwipes(!this.console_flag);
    // this.cslides.lockSwipes(false);
    $("#searchbox").on("propertychange change keyup paste input", ()=>{
      this.gslides.slideTo(0);
      // var currentVal = $(this).val();
      var currentVal=this.search_str;

      console.log(currentVal)
      this.game_init(currentVal);
      console.log("changed!");
    });
  }

}
