import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Content,NavController, Platform,ModalController,NavParams } from 'ionic-angular';
import { Chatting } from '../../components/models/chatting';
import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase';
import firebase from 'firebase';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { BigpicturePage } from '../bigpicture/bigpicture'
import { CameraselectPage} from '../cameraselect/cameraselect';
// import undefined from 'firebase/empty-import';
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  firedata = firebase.database().ref('messages');
  ngAfterViewChecked(){
  }
  picurl:any;
  mypicref:any;
  picdata:any;
  items:any;
  image:any;
  item:any;
  chatMsg=[];
  chat_date=[];
  chatContent:any;
  contents:string;
  chat={} as Chatting
  userId:string;
  flag:string;
  flag_node:string;
  id:any;
  ionViewWillEnter():void{
  }
  ionViewDidLoad(){
  }
  constructor(public platform:Platform,public modal:ModalController,private camera: Camera,public afDatabase : AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.mypicref=firebase.storage().ref('/');
    this.id=localStorage.getItem("id");
    

    this.item=this.navParams.get("item");
    this.flag=this.navParams.get("flag");
    var prefix="";

    console.log(this.id)
    this.firedata.child("message").child(this.id).once('value').then((snapshots) =>{
      this.chatMsg=[];
      this.chat_date=[];
      snapshots.forEach(element => {
        element.val().userId=this.id;
        console.log(element.val())
        this.chatMsg.push(element.val())
        this.chat_date.push(element.val().created_date.substring(0,10))
      });
      this.chat_date= this.chat_date.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      })
      console.log(this.chatMsg);
      console.log(this.chat_date)
    })

    this.firedata.once('value').then((snapshots) =>{
      snapshots.forEach(element => {
        console.log("element")
        if(element.key==="foto"){
          this.image=element.val();
        }
      });
    })
    this.firedata.once('value').then((snapshots) =>{
      snapshots.forEach(elements=>{
        console.log("!?!?!");
        if(elements.val().id!=this.userId){
          if(elements.val().read_flag=="false"){
            console.log(elements.key);
            var updating=this.afDatabase.object('/message/'+this.item.orderNo+" "+this.flag_node+'/'+elements.key)
            updating.update({read_flag:"true"})
          }
        }
      })
    })
  }
  clicked(image){
    let modal = this.modal.create(BigpicturePage,{"image":image});
    modal.onDidDismiss(data => {
      if(data!=undefined){
        console.log('comeback chatpage')
      }
    });
    modal.present();
  }
  
  async takeFoto(){
    let modal = this.modal.create(CameraselectPage);
    modal.onDidDismiss(data => {
      if(data!=undefined){
        this.picdata=data.data;
        this.upload();
      }
    });
    modal.present();
  }
  
  upload(){
    this.mypicref.child(this.uidd()).child('pic.png')
    .putString(this.picdata,'base64',{contentType:'image/jpeg'})
    .then(savepic=>{
      this.picurl=savepic.downloadURL
      this.chatMsg=[];
      this.chat_date=[];
      this.chat.content=this.picurl;
      this.chat.id=this.item.user;
      this.chat.type="foto";
      this.chat.read_flag="false";
      let today = new Date();
      let dd:number;
      let day:string;
      let month:string;
      dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      var time=new Date().toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      dd<10?day='0'+dd:day=''+dd;
      mm<10?month='0'+mm:month=''+mm;
      let todayWithTime = yyyy+'/'+month+'/'+day+' '+time;
      
      this.chat.created_date=todayWithTime;
      this.chat.onlydate=todayWithTime.substring(0,10)
      this.afDatabase.list("message/"+this.item.orderNo+"/").push(this.chat);

    }).catch(error=>{
      alert(error);
      alert(error.message);
      alert(error.code);
    })
  }

  uidd(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  entered(){
    if(this.contents!=""){
      this.chatMsg=[];
      this.chat_date=[];
      this.chat.content=this.contents;
      this.chat.id=this.id;
      this.chat.read_flag="false"
      this.contents="";
      let today = new Date();
      let dd:number;
      let day:string;
      let month:string;
      this.chat.type="string"
      dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      var time=new Date().toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      dd<10?day='0'+dd:day=''+dd;
      mm<10?month='0'+mm:month=''+mm;
      let todayWithTime = yyyy+'/'+month+'/'+day+' '+time;
      
      this.chat.created_date=todayWithTime;
      this.chat.onlydate=todayWithTime.substring(0,10)
      this.firedata.child("message").child(this.id).push(this.chat).then(()=>{

      })
      
    }else{
      alert("입력해주세요")
    }    
  }
}