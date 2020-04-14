import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    console.log("flag : ");
    console.log(this.flag);
    console.log( "user : ");
    console.log(this.user);
    console.log("hardware :"+ this.hardware);
    console.log("startDate :" + this.startDate);
    console.log("endDate : "+this.endDate);
    console.log("diff : "+this.diff);

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
    this.firemain.child('category').child(this.gamearraytrue[0].flag).child('hardware').once('value').then((snap)=>{
      console.log(snap.val())
      for(var i in snap.val()){
        if(this.hardwarename.itemcode.substring(0,2)===snap.val()[i].itemcode.substring(0,2)
        &&this.hardwarename.itemcode.substring(8,9)===snap.val()[i].itemcode.substring(8,9)
        &&Number(snap.val()[i].stock)>0){
          console.log('checked')
          this.hardwarename.itemcode=snap.val()[i].itemcode;
          console.log(snap.val()[i].itemcode)
          break;
        }
      }
      console.log(this.hardwarename.itemcode);
      this.navCtrl.push(OrderpagePage,{"startDate":this.startDate,"endDate":this.endDate,"diff":this.diff,"gamearray":this.gamearraytrue,"hardware":this.hardwarename,"user":this.user});
    })
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
                console.log(snapshot.val()[a][b][c].stock);

                if(this.hardwarearray.length===0){
                  console.log(snapshot.val()[a][b][c])
                  this.hardwarearray.push(snapshot.val()[a][b][c]);
                }

                for(var i=0;i< this.hardwarearray.length;i++){
                  if(this.hardwarearray[i].itemcode.substring(0,2)
                    ===snapshot.val()[a][b][c].itemcode.substring(0,2)&&
                    this.hardwarearray[i].itemcode.substring(8,9)
                    ===snapshot.val()[a][b][c].itemcode.substring(8,9)){
                      this.hardwarearray[i].stock+=Number(snapshot.val()[a][b][c].stock);
                      break;
                  }
                  else if(i===this.hardwarearray.length-1){
                    console.log(snapshot.val()[a][b][c])
                    this.hardwarearray.push(snapshot.val()[a][b][c]);
                  }
                }
              }

              for(var j in this.hardwarearray){
                if(Number(this.hardwarearray[j].stock)<=0){
                  this.hardwarearray[j].name+="[일시품절]"
                  console.log(this.hardwarearray[j].name);
                } 
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
        var ck=false;
        this.hardwarename=undefined;
        for(var i=0; i<this.hardwarearray.length; i++){
          if(this.hardwarearray[i].name==e.target.value.split("/")[0]){
            if(Number(this.hardwarearray[i].stock)<=0){
              alert('재고가 없는 게임기 입니다.');
              e.target.value="no"
              break;
            }
            else{
              this.hardwarename=this.hardwarearray[i];
              ck=true;
            }
          }
        }
        if(ck===true){
          console.log(e.target.value);
          this.totalprice2=this.totalprice;
          this.totalprice2+=Number(e.target.value.split("/")[1]);
          this.total=this.totalprice2;
          if(isNaN(this.total)){
            this.total=0;
          }

        }
      });
    });
  }
}
