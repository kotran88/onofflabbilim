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
  id:any;
  userid:any;
  orderlist=[];
  user:any;
  point:any;
  image_url:any;
  key:any;
  mypicref:any;
  lloading:any;
  deviceId='ac18e96c-c5ee-4d94-8eb7-f7d934c3e41a';

  firemain = firebase.database().ref();
  constructor(public loading:LoadingController,public platform:Platform,public modal:ModalController,public alertCtrl : AlertController,public camera:Camera,public navCtrl: NavController, public navParams: NavParams, public http:Http) {
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

  returned(value){
    console.log(value)

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

  dateck(n){
    this.orderlist[n].orderdate=
    this.orderlist[n].orderdate.split(' ')[0]+'T'+
    this.orderlist[n].orderdate.split(' ')[1];

    if(Number(this.orderlist[n].orderdate.split('T')[0].split('-')[1])<10){
      this.orderlist[n].orderdate=
      this.orderlist[n].orderdate.split('T')[0].split('-')[0]+'-+'+
      this.orderlist[n].orderdate.split('T')[0].split('-')[1]+'-'+
      this.orderlist[n].orderdate.split('T')[0].split('-')[2]+
      this.orderlist[n].orderdate.split('T')[1];
    }

    if(Number(this.orderlist[n].orderdate.split('T')[0].split('-')[2])<10){
      this.orderlist[n].orderdate=
      this.orderlist[n].orderdate.split('T')[0].split('-')[0]+'-'+
      this.orderlist[n].orderdate.split('T')[0].split('-')[1]+'-+'+
      this.orderlist[n].orderdate.split('T')[0].split('-')[2]+
      this.orderlist[n].orderdate.split('T')[1];
    }

    for(var i=0;i<this.orderlist[n].orderdate.length;i++){
      if(this.orderlist[n].orderdate[i]==='+'){
        this.orderlist[n].orderdate[i]=' ';
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MypagePage');
  }

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
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

  uploadImage(imageURI,index){
    let storageRef = firebase.storage().ref();
    var result="design"+(index+1);
    console.log(imageURI);
    imageURI=  "data:image/png;base64," + imageURI;
    console.log("sssssssssss : "+result);
    console.log(imageURI);
    console.log("donE!!!!!!!!!!")

    this.mypicref=firebase.storage().ref('imagelist/');
    this.key=this.firemain.child("list").push().key;
    var a = this.mypicref.child(this.key).child(result)
    this.encodeImageUri(imageURI, (image64)=>{
      a.putString(image64, 'data_url')
      .then(snapshot => {
        this.mypicref.child(this.key).child(result).getDownloadURL().then((url)=>{
          console.log("download url is : "+url);
          this.image_url=url;
          this.loading_off();

          window.alert("사진업로드 완료!")
          this.send_push();
          // this.view.dismiss({'data':url})

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

  send_push(){
    console.log('ready');

    // this.firemain.child("users").child(this.temp_data.phone).child('orderlist').update(
    //   {
    //     'status':'delivered'
    //   }
    // );
    // this.picker_image();
    this.image_url="https://firebasestorage.googleapis.com/v0/b/bilim-fd9b0.appspot.com/o/vr%2Fgamename%2F%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%8C%E1%85%A1%E1%84%8B%E1%85%B4%20%E1%84%8B%E1%85%A1%E1%84%90%E1%85%B3%E1%86%AF%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A6.jpg?alt=media&token=bacd3478-1641-4582-a445-e8b26d306ab6"

    console.log("sendpushnotification")
    console.log(this.deviceId)
    let data={
      "app_id": "6505b348-1705-4d73-abe4-55ab40758266",
      "include_player_ids": [this.deviceId],
      "headings":{"en":"주문하신 게임이 도착하였습니다."},
      "ios_badgeType":"Increase",
      "ios_badgeCount":1,
      "data": {"welcome": "pdJung", "store":'this.store'},
      "contents": {"en": "배송완료"},
      "big_picture":this.image_url,
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
