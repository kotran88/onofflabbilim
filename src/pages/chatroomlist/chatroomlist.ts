import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { ChatPage } from '../chat/chat';
import { OneSignal } from '@ionic-native/onesignal/ngx';

/**
 * Generated class for the ChatroomlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chatroomlist',
  templateUrl: 'chatroomlist.html',
})
export class ChatroomlistPage {
  firemain = firebase.database().ref('users');

  userlist=[];
  id='';
  admin_id="01079998598";

  constructor(public oneSignal:OneSignal,public navCtrl: NavController, public navParams: NavParams) {

    this.id=localStorage.getItem('id');
    // this.id='01023393927'

    this.OneSignalInstall()

    if(this.id===this.admin_id){
      this.firemain.once('value').then((snap)=>{
        for(var i in snap.val()){
          if(snap.val()[i].phone!=this.admin_id)
          this.userlist.push(snap.val()[i]);
        }
      })
    }
    else{
      this.navCtrl.push(ChatPage,{"user":{phone:this.id}});  
    }
  }

  room_selecte(user){
    console.log(user)
    this.navCtrl.push(ChatPage,{"user":user});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatroomlistPage');
  }

  OneSignalInstall()
  {
    this.oneSignal.startInit('6505b348-1705-4d73-abe4-55ab40758266');
    console.log("onesignal-2-2");
    // this.oneSignal.clearOneSignalNotifications();
    console.log("onesignal 00");
    var iosSettings = {
      "kOSSettingsKeyAutoPrompt" : true,
      "kOSSettingsKeyInAppLaunchURL" : true
    };
    console.log("onesignal 11");
    this.oneSignal.iOSSettings(iosSettings);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    console.log("onesignal 22");

    console.log("onesiganl get id startedddddd")
    this.oneSignal.getIds().then(data => {
      console.log(data);
      console.log("get id success"+data.userId)
      this.firemain.child("users").child(this.id).update({"deviceId":data.userId})
      localStorage.setItem("tokenvalue",data.userId);

    }).catch((e)=>{
      // window.alert("onesignal error"+e);
      console.log("onesignal error : "+e);
    })
    this.oneSignal.endInit();
  }
}
