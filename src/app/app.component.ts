import { Component } from '@angular/core';
import { Platform ,ViewController,App,AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen';

<<<<<<< HEAD
<<<<<<< HEAD
import { MypagePage} from '../pages/mypage/mypage'

=======
import { OrderpagePage } from '../pages/orderpage/orderpage';

import { SignupPage } from '../pages/signup/signup';
import { ChatPage } from '../pages/chat/chat';
>>>>>>> 322365da8d0c3401aadb04173566d3fe9e67ad26
=======
import { MypagePage} from '../pages/mypage/mypage'

>>>>>>> 34858be320f26e84b6b0cf2471c4b03387c69d07
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = HomePage;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 34858be320f26e84b6b0cf2471c4b03387c69d07
  rootPage:any=MypagePage;

  constructor(platform: Platform/* , statusBar: StatusBar, splashScreen: SplashScreen */) {
=======
  rootPage:any=HomePage;
app:any;
  constructor( app : App,public alertCtrl:AlertController,statusBar: StatusBar,platform: Platform/* , statusBar: StatusBar, splashScreen: SplashScreen */) {
    this.app=app;
>>>>>>> 322365da8d0c3401aadb04173566d3fe9e67ad26
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

