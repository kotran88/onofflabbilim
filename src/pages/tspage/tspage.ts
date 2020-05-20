import { Component, NgZone, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, ModalController } from 'ionic-angular';
import firebase from 'firebase/app';
import {LoginpagePage} from '../loginpage/loginpage'
import { GameDetailPage } from '../game-detail/game-detail';
import * as $ from 'jquery';

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

  first_flag=false;

  all_data:any;
  gamearray:any;
  gamearray2:any;
  hardwarearray:any;
  count=0;
  search_str='';

  game_slide:any;
  slide_num:any;

  select_list:any;
  select_num:any;

  init_flag:any;
  firemain = firebase.database().ref();

  constructor(public modal:ModalController, public alertCtrl:AlertController,public zone: NgZone,public navCtrl: NavController, public navParams: NavParams) {

    this.select_list=[{}];
    this.select_list[0]={name:'닌텐도 스위치',key:'switch'};
    this.select_list[1]={name:'플레이 스테이션',key:'ps'};
    this.select_num=0;
    this.slide_num=0;
    console.log(this.select_list)

    this.gamearray=[{}];
    this.hardwarearray=[{}]

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
      this.game_init()
    })
  }

  slideChanged(){
    if(this.init_flag===true){
      this.init_flag=false;
      console.log(this.slides.getActiveIndex())
      this.select_num = this.slides.getActiveIndex();
      this.gslides.slideTo(0);
      this.select_num%=2
      this.select_num=1-this.select_num;
      this.slide_num=0;
      this.search_str='';
      console.log(this.select_num)
      this.game_init();
    }
  }

  slideChanged2(){
    this.slide_num = this.gslides.getActiveIndex();
    console.log(this.slide_num)
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
    this.gamearray2=[];

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
    // for(var i in Data.hardware){
    if(this.init_flag===false){
      this.hardwarearray=[];
      this.hardwarearray=Data.hardware;
      // }
      console.log(this.gamearray);
      console.log(this.hardwarearray);
  
      for(var ii in this.gamearray){
        this.gamearray[ii].fflag=false;
        this.gamearray[ii].check=false;
      }
    }
    console.log(this.gamearray);
    console.log(this.hardwarearray);
    this.game_sort(num);
    this.push_slide()
    this.init_flag=true;
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
      this.gamearray2=this.gamearray;
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
    console.log(game);
    console.log("g")
    let modal = this.modal.create(GameDetailPage, {game:game}, { cssClass: 'test-modal' });
    modal.present();
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
    // if((n==-1&&this.slides.getActiveIndex()===0)
    // ||(n==1&&this.slides.getActiveIndex()===2)){
    //   this.slides.slideTo(1);
    // }
    // else this.slides.slideTo(this.slides.getActiveIndex()+n);

    if(n>0) this.slides.slideNext();
    else this.slides.slidePrev();
    this.slideChanged();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TspagePage');
//propertychange change keyup paste input
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
