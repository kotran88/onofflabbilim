import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams } from 'ionic-angular';

import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
/**
 * Generated class for the CameraselectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-cameraselect',
  templateUrl: 'cameraselect.html',
})
export class CameraselectPage {

  constructor(public viewCtrl: ViewController,public camera:Camera,public navCtrl: NavController, public navParams: NavParams) {
  }
  takePhoto(){
    try{
      const options : CameraOptions={
        quality:100,
        targetHeight:5616,
        targetWidth:5616,
        destinationType:this.camera.DestinationType.DATA_URL,
        encodingType:this.camera.EncodingType.JPEG,
        mediaType:this.camera.MediaType.PICTURE,
        saveToPhotoAlbum:true
      }
      const result= this.camera.getPicture(options).then(imagedata=>{
        this.viewCtrl.dismiss({data:imagedata});
        
      })


    }catch(e){
      console.log("error "+e);
    }
  }
  getPhoto(){
    const options : CameraOptions={
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType:this.camera.DestinationType.DATA_URL,     
      quality: 100,
      targetWidth: 5616,
      targetHeight: 5616,
      encodingType: this.camera.EncodingType.JPEG,      
      correctOrientation: true
    }
    const result= this.camera.getPicture(options).then(imagedata=>{
      this.viewCtrl.dismiss({data:imagedata});
      
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraselectPage');
  }
  confirm(){
    this.viewCtrl.dismiss();
  }
}
