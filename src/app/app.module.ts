import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, ViewController,IonicErrorHandler, IonicModule } from 'ionic-angular';
// import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginpagePage} from './../pages/loginpage/loginpage'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { IamportCordova } from '@ionic-native/iamport-cordova';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import * as firebase from 'firebase/app';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {DetailPage } from './../pages/detail/detail'
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { StarRatingModule } from 'ionic3-star-rating';
import { MypagePage} from './../pages/mypage/mypage'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { OrderpagePage } from '../pages/orderpage/orderpage';
import { Modalbottom } from '../pages/modalbottom/modalbottom';
import { ModalpagePage } from '../pages/modalpage/modalpage';
import { SignupPage } from '../pages/signup/signup';
import { DeliveryAreaPage } from '../pages/delivery-area/delivery-area';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { GameDetailPage } from '../pages/game-detail/game-detail';
<<<<<<< HEAD
<<<<<<< HEAD
import { HttpModule } from '@angular/http';

=======
import { ChatPage } from '../pages/chat/chat';
import { CameraselectPage } from './../pages/cameraselect/cameraselect'
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { HttpModule } from '@angular/http'
// import { ChatroomlistPage } from '../pages/chatroomlist/chatroomlist';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { CoinsPage } from '../pages/coins/coins';
import { SettingPage } from '../pages/setting/setting';

import { FirstlandingPage } from '../pages/firstlanding/firstlanding';
<<<<<<< HEAD
>>>>>>> 322365da8d0c3401aadb04173566d3fe9e67ad26
=======
import { HttpModule } from '@angular/http';

>>>>>>> 34858be320f26e84b6b0cf2471c4b03387c69d07
=======
import { PaymentPage } from '../pages/payment/payment';
>>>>>>> d2cc2816856fc227fab15a391c5f6333b492cdfe
var firebaseConfig = {
  apiKey: "AIzaSyAn_AiRNImCttmallAmGspg1tOMDwDgFuo",
  authDomain: "bilim-fd9b0.firebaseapp.com",
  databaseURL: "https://bilim-fd9b0.firebaseio.com",
  projectId: "bilim-fd9b0",
  storageBucket: "bilim-fd9b0.appspot.com",
  messagingSenderId: "609791307988",
  appId: "1:609791307988:web:12d29bbbed509f9f930b41",
  measurementId: "G-ZCMV9QVCVE"
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailPage,
    MypagePage,
    LoginpagePage,
    OrderpagePage,
    ModalpagePage,
    ChatPage,
    SignupPage,
    SettingPage,
    Modalbottom,
    DeliveryAreaPage,
    GameDetailPage,
    FirstlandingPage,
    CameraselectPage,
    CoinsPage,
    PaymentPage
    // ChatroomlistPage,
  ],
  imports: [
    BrowserModule,
    StarRatingModule,
    IonicModule.forRoot(MyApp),
    AngularFireDatabaseModule,
<<<<<<< HEAD
<<<<<<< HEAD
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
=======
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig)
>>>>>>> 322365da8d0c3401aadb04173566d3fe9e67ad26
=======
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
>>>>>>> 34858be320f26e84b6b0cf2471c4b03387c69d07
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DetailPage,
    LoginpagePage,
    CoinsPage,
    SettingPage,
    HomePage,
    MypagePage,
    ChatPage,
    SignupPage,
    ModalpagePage,
    FirstlandingPage,
    Modalbottom,
    OrderpagePage,
    DeliveryAreaPage,
    GameDetailPage,
    CameraselectPage,
    PaymentPage
    // ChatroomlistPage,
  ],
  providers: [
    StatusBar,
    // SplashScreen,
    AppVersion,
    Camera,
    InAppBrowser,
    OneSignal,
    AngularFireAuth,
    DatePicker,
<<<<<<< HEAD
<<<<<<< HEAD
    Camera,
=======
    PhotoViewer,
>>>>>>> 322365da8d0c3401aadb04173566d3fe9e67ad26
=======
    Camera,
>>>>>>> 34858be320f26e84b6b0cf2471c4b03387c69d07
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
