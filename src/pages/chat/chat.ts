import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { IonicPage, AlertController,Content,NavController, Platform,ModalController,NavParams,LoadingController} from 'ionic-angular';
import { Chatting } from '../../components/models/chatting';
import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase';
import * as firebase from "firebase";
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { CameraselectPage} from '../cameraselect/cameraselect';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Http, RequestOptions, Headers} from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { observable } from 'rxjs';

// import undefined from 'firebase/empty-import';
/*
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

  @ViewChild(Content) chatlist:Content
  @ViewChild('myinput') myInput:Input ;

  firemain=firebase.database().ref();
  firedata = firebase.database().ref('message');
  mypicref:any;

  name:any;
  userid:any;
  admin={deviceIds:[]};
  nowtime:any;
  // take_image_data:any;
  lloading:any;
  keyboard_check=false;

  // chat=[{user:'',text:'',image:'',date:'',ck:''}];
  chat=[];

  input={user:'',text:'',image:'',date:'',ck:''};
  chat_cnt:any;
  bottomcnt:any;
  pltname = '';
  constructor(private keyboard: Keyboard,public alertCtrl:AlertController,public loading:LoadingController, public http:Http, private photoViewer: PhotoViewer, public platform:Platform,public modal:ModalController,private camera: Camera,public afDatabase : AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    if(this.platform.is('ios')){
      this.pltname = 'ios';
      console.log(this.pltname);
    }
    else if(this.platform.is('android')){
      this.pltname = 'android';
      console.log(this.pltname);
    }
    var user=navParams.get("user");
    this.userid=user.phone;
    this.name=user.name;

    this.firemain.child('admin').child('deviceIds').once('value').then((snap)=>{
      console.log(snap.val())
      this.admin.deviceIds=[];
      for(var s in snap.val()){
        this.admin_push(snap.val()[s]);
      }
      console.log(this.admin);
    })


    console.log(this.userid)

    this.firedata.child(this.userid).on('value',(snapshots) =>{
      this.read_log(snapshots.val())
    })

    addEventListener('keyboardWillShow', () => {
      // this.bottomcnt=setTimeout(() => {
      //   this.chatlist.scrollToBottom();
      // }, 1000);
    });
    addEventListener('onKeyboardWillHide',()=>{
      // console.log(this.keyboard.isVisible);
      // console.log(this.keyboard_check);
      // if(this.keyboard.isVisible!=this.keyboard_check){
      //   console.log('?!?!?!?!?')
      //   if(this.keyboard_check===true){
      //     this.keyboard.show();
      //     console.log('keyboard show!!')
      //   }
      //   else{
      //     this.keyboard.hide();
      //     console.log('keyboard hide!!')
      //   }
      // }
    });
    addEventListener('onKeyboardHide',()=>{
      // console.log(this.keyboard.isVisible);
      // console.log(this.keyboard_check);
      // if(this.keyboard.isVisible!=this.keyboard_check){
      //   console.log('?!?!?!?!?')
      //   if(this.keyboard_check===true){
      //     this.keyboard.show();
      //     console.log('keyboard show!!')
      //   }
      //   else{
      //     this.keyboard.hide();
      //     console.log('keyboard hide!!')
      //   }
      // }
    });
    let backAction =  platform.registerBackButtonAction(() => {
      clearTimeout(this.bottomcnt);
      this.navCtrl.pop();
      backAction();
    },2)
    // addEventListener('keyboardDidHide', () => {
    //   console.log("Keyboard is Hidden");
    //   console.log(this.keyboard.isVisible);
    //   console.log(this.keyboard_check);
    //   if(this.keyboard.isVisible!=this.keyboard_check){
    //     console.log('?!?!?!?!?')
    //     if(this.keyboard_check===true){
    //       this.keyboard.show();
    //       console.log('keyboard show!!')
    //     }
    //     else{
    //       this.keyboard.hide();
    //       console.log('keyboard hide!!')
    //     }
    //     this.keyboard_check=false;
    //   }
    // });
  }

  admin_push(num){
    this.firemain.child('users').child(num).child('deviceId').once('value').then((snap)=>{
      this.admin.deviceIds.push(snap.val());
      console.log(num,snap.val())
    })
  }

  keyboardchecker_reset(n){
    // this.keyboard_check=n;
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

  goback(){
    clearTimeout(this.bottomcnt);
    this.navCtrl.pop();
  }

  read_log(data){
    console.log(data)
    this.chat_cnt=0;
    for(var i in data){

      console.log(data[i]);

      this.chat[this.chat_cnt]={user:data[i].user,text:data[i].text,date:data[i].date,image:data[i].image};

      if(data[i].user!=this.userid){
        this.chat[this.chat_cnt].ck=' ';
      }
      else this.chat[this.chat_cnt].ck=data[i].ck;

      console.log(this.chat[this.chat_cnt])
      this.chat_cnt++;
    }

    console.log(this.chat);
    console.log();

    this.bottomcnt=setTimeout(() => {
      this.chatlist.scrollToBottom();
    }, 2000);
  }

  pad(n, width):String{
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
  }

  now_time():String{
    var time=new Date();
    this.nowtime=
    this.pad(time.getFullYear(),4)+'-'+this.pad((time.getMonth()+1),2)+'-'+this.pad(time.getDate(),2)
    +'|'+
    this.pad(time.getHours(),2)+':'+this.pad(time.getMinutes(),2)+':'+this.pad(time.getSeconds(),2)+':'+this.pad(time.getMilliseconds(),3);
    console.log(this.nowtime)

    return this.nowtime;
  }

  clicked(image){
    this.photoViewer.show(image);
  }

  takePhoto(){
    let modal = this.modal.create(CameraselectPage,{},{cssClass : "pictureModal"});
    modal.onDidDismiss(data => {
      if(data!=undefined){
        console.log(data);
        this.input.image=data.data;
        this.upload(1);
      }
      else{
        this.input.image='';
      }
    });
    modal.present();
  }

  upload(mode){
    this.keyboard_check=true;
    if(mode===0){
      this.input.user=this.userid;
      this.input.date=this.nowtime;
      this.input.ck="1";
      this.firedata.child(this.userid).child(this.nowtime).update(this.input)
      .then(()=>{
        this.input.text='';
        this.input.image='';
      });
    }
    else{
      console.log('user : '+this.userid)
      console.log('nowtime : '+this.now_time())
      if(this.input.text===''&&this.input.image===''){
       this.confirmAlert2('전송할 정보를 입력해주세요.');
      }
      else if(this.input.image!=''&&this.input.image!=undefined){
        this.uploadImageToFirebase(this.input.image,0)
        this.input.image='';
      }
      else{
        this.chatlist.scrollToBottom();
        this.upload(0);
        this.send_push('문의 올립니다 ('+this.name+','+this.userid+')',this.input.text,'');
      }
    }
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

  uploadImageToFirebase(image,index){
    console.log("upload iamge to firebase");
    console.log(image);
    this.loading_on();
    this.uploadImage(image,index)
  }

  uploadImage(imageURI,index){
    let storageRef = firebase.storage().ref();
    var result='U'+this.nowtime;
    console.log(imageURI);
    imageURI=  "data:image/png;base64," + imageURI;
    console.log("sssssssssss : "+result);
    console.log(imageURI);
    console.log("donE!!!!!!!!!!")

    this.mypicref=firebase.storage().ref('message/');
    // this.key=this.nowtime();
    var a = this.mypicref.child(this.userid).child(result.toString());
    this.encodeImageUri(imageURI, (image64)=>{
      a.putString(image64, 'data_url')
      .then(snapshot => {
        this.mypicref.child(this.userid).child(result.toString()).getDownloadURL().then((url)=>{
          console.log("download url is : "+url);
          this.input.image=url;
          // alert("download url is : "+url);
          this.upload(0);
          this.send_push('문의 올립니다 ('+this.name+','+this.userid+')','사진이 도착했습니다.',this.input.image);
          this.loading_off();
          // window.alert("완료!")

        }).catch((e)=>{
          console.log('eeeee');
          console.log(e);
        })

      }).catch((e)=>{
        console.log("error is....")
        this.confirmAlert2('error : '+e);
        console.log(e);
      })
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/png");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  send_push(header,content,url){
    console.log('ready');

    // this.status_change(this.check_order,'delivered');

    console.log(this.admin.deviceIds);
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
}
