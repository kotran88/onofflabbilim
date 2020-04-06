import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import firebase from 'firebase';


import { OrderpagePage } from './../../pages/orderpage/orderpage';
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
gamearray=[];
hardwarearray=[];
hardwarename:any;
gamearraytrue=[];
diff:any;
startDate:any;
totalprice2=0;
endDate:any;
total=0;
totalprice=0;
flag:any;
hardware:any;
user:any;
points:any;
count:any=0;
firemain = firebase.database().ref();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.flag= this.navParams.get("flag");
    this.hardware=this.flag.flag
   this.gamearray= this.navParams.get("list");
   this.startDate=this.navParams.get("startDate");
   this.endDate=this.navParams.get("endDate");
   this.diff=this.navParams.get("diff");
   this.user=this.navParams.get("user");
   console.log(this.user)
   if(this.user.point==undefined){
     this.points=0;
   }else{
    this.points=this.user.point;
   }

   for(var i=0; i<this.gamearray.length; i++){
     var flag=this.gamearray[i].fflag;
     console.log(flag)
     if(flag==true){
      this.gamearraytrue.push(this.gamearray[i])
      this.count++;
     }
   }
   window.alert(this.count)
   console.log(this.gamearraytrue)
   var a = 0;
   for(var i=0; i<this.gamearraytrue.length; i++){
     a+=this.gamearraytrue[i].price*this.diff;
   }
   this.total=a;
   this.totalprice=a;
   this.totalprice2=a;
   this.generatehardware();
  }
  orderpage(){
    console.log("come to orderpage")
    this.navCtrl.push(OrderpagePage,{"startDate":this.startDate,"endDate":this.endDate,"diff":this.diff,"gamearray":this.gamearraytrue,"hardware":this.hardwarename,"user":this.user});

  }
  teest(){
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

  generatehardware(){


    this.firemain.child("category").once("value",(snapshot)=>{
      for(var a in snapshot.val()){
        console.log(a)
        if(a==this.hardware){
               for(var b in snapshot.val()[a]){
            console.log(b);
            console.log(snapshot.val()[a][b])
          
             if(b=="hardware"){
              for(var c in snapshot.val()[a][b]){
                this.hardwarearray.push(snapshot.val()[a][b][c]);
              }
            }
        }  
      }
    }
    console.log(this.hardwarearray)
    })

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalpagePage');

    $( document ).ready(()=>{
      // code goes here
      $('#mySelect').change((e)=>{
        for(var i=0; i<this.hardwarearray.length; i++){
          if(this.hardwarearray[i].name==e.target.value.split("/")[0]){
            this.hardwarename=this.hardwarearray[i];
          }
        }
        console.log(e.target.value);
       this.totalprice2=this.totalprice;
       this.totalprice2+=Number(e.target.value.split("/")[1]);
       this.total=this.totalprice2;
       if(isNaN(this.total)){
         this.total=0;
       }
   });
  });

  }

}
