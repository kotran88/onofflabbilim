import { Component } from '@angular/core';
import { IonicPage,ViewController,NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import * as $ from 'jquery'
import { IamportCordova ,PaymentObject} from '@ionic-native/iamport-cordova';
/**
 * Generated class for the OrderpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orderpage',
  templateUrl: 'orderpage.html',
})
export class OrderpagePage {
  arraylist=[]
  src:any;

  newcount:any=0;
  selected:any;
  count:any=0;

  firemain = firebase.database().ref();
  lastchecked:any;
  gamearray=[];
  user:any;
  hardware:any;
  postcode:any;
  address:any;
  diff:any;
  totalprice:any;
  point:any;
  startDate:any;
  endDate:any;
  constructor(public v:ViewController,public navCtrl: NavController, public navParams: NavParams) {
    this.arraylist.push({"title":"abc","notice":"ba"})
    this.arraylist.push({"title":"ab2c","notice":"ba"})
    this.arraylist.push({"title":"abc3","notice":"ba"})
    this.arraylist.push({"title":"ab4c","notice":"ba"})

    this.startDate=this.navParams.get("startDate");
    this.endDate=this.navParams.get("endDate");
    this.user=this.navParams.get("user");
    this.point=this.user.point
    this.diff=this.navParams.get("diff");
    this.hardware=this.navParams.get("hardware");
    this.gamearray=this.navParams.get("gamearray")

    var a = 0;
    for(var i=0; i<this.gamearray.length; i++){
      a+=this.gamearray[i].price*this.diff;
    }
    var b = 0;
    if(this.hardware!=undefined){
      b=this.hardware.pricedaily

      console.log(b+"game price total is : "+a);
    }

    console.log(this.startDate);
    console.log(this.endDate);
    console.log(this.diff);
    console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
    
    console.log(this.user);
    console.log(this.hardware);
    console.log(this.gamearray)
    console.log("total price is : "+(Number(a)+Number(b)));
    this.totalprice=(Number(a)+Number(b));
  }
  btnclicked(){
   var a =  $("#a").val();
   var b =  $("#b").val();
   var c =  $("#c").val();

   this.postcode=a;
   this.address=b;
  }
  gotoback(){
    this.v.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderpagePage');
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
    // if(this.open_tab==0){
    //   console.log("open title");
    //   this.open_tab=1;

    // }
    // else {
    //   console.log("close title");
    //   this.open_tab=0;
    // }
  }
  orderpage(){

 var data = {
  pay_method : 'card',
      merchant_uid: 'mid_' + new Date().getTime(),
      name : '주문명:결제테스트',
      amount : "1",
      app_scheme : 'ionickcp',
      buyer_email : 'iamport@siot.do',
      buyer_name : '구매자이름',
      buyer_tel : '010-1234-5678',
      buyer_addr : '서울특별시 강남구 삼성동',
      buyer_postcode : '123-456'
    };


    var PaymentObject={
      userCode: "imp58611631",
      data: data,
      callback:(response)=> {
        console.log(response);
        if(response.imp_success=="true"){
          console.log("success")
          console.log(this.gamearray);
          console.log(this.hardware);
          console.log(this.totalprice);
          var now=new Date();
          var year=now.getFullYear();
          var month=now.getMonth()+1;
          var date=now.getDate();
          var hour=now.getHours();
          var min=now.getMinutes();
          var nnow=year+"-"+month+"-"+date+" "+hour+":"+min;
          console.log(nnow);
          if(this.hardware!=undefined){
            this.firemain.child("users").child(this.user.key).child("orderlist").push({"startDate":this.startDate,"endDate":this.endDate,"diff":this.diff,"orderdate":nnow,"game":this.gamearray,"hardware":this.hardware,"payment":this.totalprice}).then(()=>{

            }).catch((e)=>{
              console.log(e);
            })
  
          }else{
            this.firemain.child("users").child(this.user.key).child("orderlist").push({"startDate":this.startDate,"endDate":this.endDate,"diff":this.diff,"orderdate":nnow,"game":this.gamearray,"payment":this.totalprice}).then(()=>{

            }).catch((e)=>{
              console.log(e);
            })
  
          }
          
        }
         },   
    }
        
    
    // 아임포트 관리자 페이지 가입 후 발급된 가맹점 식별코드를 사용
    IamportCordova.payment(PaymentObject )
      .then((response)=> {
        alert("success")
        alert(JSON.stringify(response))
      })
      .catch((err)=> {
        alert(err)
      })
    ;
  }
}
