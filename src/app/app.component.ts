import { Component } from '@angular/core';
import { Platform ,ViewController,App,AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen';

import { MypagePage} from '../pages/mypage/mypage'

import { OrderpagePage } from '../pages/orderpage/orderpage';

import { SignupPage } from '../pages/signup/signup';
import { ChatPage } from '../pages/chat/chat';
import { HomePage} from '../pages/home/home'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = HomePage;
  // rootPage:any=MypagePage;
  rootPage:any=HomePage;
  app:any;
  constructor( app : App,public alertCtrl:AlertController,statusBar: StatusBar,platform: Platform/* , statusBar: StatusBar, splashScreen: SplashScreen */) {
    this.app=app;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // splashScreen.hide();


      if(platform.is('android') ) {
        statusBar.backgroundColorByHexString('#ffffff');
      };
     

      // if(platform.is("android")||platform.is("ios")){
    
      //   screen.lock(screen.ORIENTATIONS.PORTRAIT_PRIMARY);
  
      // }
 
       
   
      // setTimeout(()=>{
      //   platform.registerBackButtonAction(() => {
  
      //     let nav = this.app.getActiveNav();
      //     let activeView = nav.getActive();
      //   console.log("back pressed");
      //   console.log(nav)
      //   console.log(activeView)
      //   console.log(view)
      //   window.alert(view.name)
      //   view.dismiss();

      //       });
  
      //   },200);
    });
  }
}

