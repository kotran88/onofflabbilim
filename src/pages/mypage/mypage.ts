import { Component } from '@angular/core';
import { Http, RequestOptions, Headers} from '@angular/http';
import { updateDate } from 'ionic-angular/umd/util/datetime-util';
import { IonicPage,Platform,ModalController,AlertController, NavController, NavParams, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { ChatPage } from '../chat/chat';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CoinsPage } from '../coins/coins';
import { SettingPage } from '../setting/setting';
/**
 * Generated class for the MypagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MypagePage {
  [x: string]: any;
  id:any;
  userid:any;
  orderlist=[];
  user:any;
  point:any;
  image_url:any;
  key:any;
  mypicref:any;
  lloading:any;
  check_order:any;
  deviceId:any;
  // deviceId="61acf6b0-73f3-40a2-8b19-fc85697494c0";

  firemain = firebase.database().ref();
  constructor(public loading:LoadingController,public platform:Platform,public modal:ModalController,public alertCtrl : AlertController,public camera:Camera,public navCtrl: NavController, public navParams: NavParams, public http:Http) {
    this.firemain.child('admin').once('value').then((snap)=>{
      this.deviceId=snap.val().deviceId;
    })

    this.id=navParams.get("id")
    this.user=navParams.get("user");
    console.log(this.id,this.user)
    if(this.user.points==undefined){
      this.point=0;
    }else{
      this.point=this.user.points;
    }
    console.log(this.id,this.userid);
    console.log("user is : ");
    console.log(this.user);
    this.refreshorder();
    console.log(this.id,this.userid);

    let backAction =  platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    },2)
  }

  refreshorder(){
    this.orderlist=[];
    this.firemain.child("users").child(this.id).child("orderlist").once("value",(snap)=>{
      var cnt=0;
      for(var a in snap.val()){
        this.orderlist.push(snap.val()[a]);
        // this.dateck(cnt)
        // this.orderlist[cnt].phone=snap.val().phone;
        cnt++;
      }
      console.log(this.orderlist);
    })
  }

  goback(){
    this.navCtrl.pop();
  }

  go_chat(){
    this.navCtrl.push(ChatPage,{"id":this.id})
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad MypagePage');
  }

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
  }

  status_change(status){
    
    console.log('status : ',status)
    this.firemain.child('users').child(this.id).child('orderlist').child(this.check_order.key).update({status:status}).then(()=>{
      this.refreshorder();
    })
  }

  returned(a){
    this.check_order=a;
    console.log("Take photo!!!!");
    try{
      const options : CameraOptions={
        quality:50,
        targetHeight:600,
        targetWidth:600,
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType:this.camera.DestinationType.DATA_URL,
        encodingType:this.camera.EncodingType.JPEG,
        mediaType:this.camera.MediaType.PICTURE,
        saveToPhotoAlbum:true
      }
      this.camera.getPicture(options).then(imagedata=>{

        this.loading_on();
        console.log("retrieved image is : ");
        console.log(imagedata)

        console.log(imagedata.data);
        if(imagedata!=undefined){
          console.log("uploading........");
          this.uploadImageToFirebase(imagedata,0);
        }
      })
    }catch(e){
      console.log("error "+e);
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
    this.uploadImage(image,index)
  }

  stfm(num,len):string{
    var str=String(num);

    for(var i=str.length;i<len;i++){
      str='0'+str;
    }

    return str;
  }

  nowtime():string{
    var time:any;
    var now=new Date();

    time='R ';

    time+=this.stfm(now.getFullYear(),4)+'-'+this.stfm((now.getMonth()+1),2)+'-'+this.stfm(now.getDate(),2)+'|'+
    this.stfm(now.getHours(),2)+':'+this.stfm(now.getMinutes(),2)+':'+this.stfm(now.getSeconds(),2);

    return time;
  }

  uploadImage(imageURI,index){
    let storageRef = firebase.storage().ref();
    var result=this.nowtime();
    console.log(imageURI);
    imageURI=  "data:image/png;base64," + imageURI;
    console.log("sssssssssss : "+result);
    console.log(imageURI);
    console.log("donE!!!!!!!!!!")

    this.mypicref=firebase.storage().ref('imagelist/');
    // this.key=this.nowtime();
    var a = this.mypicref.child(this.id).child(result);
    this.encodeImageUri(imageURI, (image64)=>{
      a.putString(image64, 'data_url')
      .then(snapshot => {
        this.mypicref.child(this.id).child(result).getDownloadURL().then((url)=>{
          console.log("download url is : "+url);
          this.loading_off();
          // alert("download url is : "+url);

          this.send_push('수거요청','수거를 요청합니다.('+this.check_order.startDate.split("T")[0]+')',url);
          this.status_change('return');

          window.alert("완료!")

        }).catch((e)=>{
          console.log('eeeee');
          console.log(e);
        })
       
      }).catch((e)=>{
        console.log("error is....")
        window.alert(e);
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

    console.log("sendpushnotification")
    let data={
      "app_id": "6505b348-1705-4d73-abe4-55ab40758266",
      "include_player_ids": [this.deviceId],
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
