import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { Http, RequestOptions, Headers} from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { updateDate } from 'ionic-angular/umd/util/datetime-util';


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

  lloading:any;

  mypicref:any;
  key:any;
  firemain = firebase.database().ref();
  deviceId:any;
  temp_data:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,private camera: Camera,public loading:LoadingController) {
    this.firemain.child("users").once("value",(snap)=>{
      console.log(snap.val())
      for(var i in snap.val()){
        console.log(i,snap.val()[i])
        if(snap.val()[i].orderlist){
          console.log(snap.val()[i].orderlist)
          for(var j in snap.val()[i].orderlist){
            console.log(snap.val()[i].orderlist[j])
            if(snap.val()[i].orderlist[j].status==='paid'){
              this.orderlist.push(snap.val()[i].orderlist[j]);
              this.orderlist[this.orderlist.length-1].deviceId=snap.val()[i].deviceId;
              this.orderlist[this.orderlist.length-1].phone=snap.val()[i].phone;
            }
          }
        }
      }
    }).then(()=>{
      console.log(this.orderlist)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MypagePage');
  }

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
  }

  picker_image(a){
    this.deviceId=a.deviceId;
    this.temp_data=a;
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

    this.firemain.child("users").child(this.temp_data.phone).child('orderlist').update(
      {
        'status':'delivered'
      }
    );
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