import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, ViewController,IonicErrorHandler, IonicModule, NavController} from 'ionic-angular';
// import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginpagePage} from './../pages/loginpage/loginpage'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { IamportCordova } from '@ionic-native/iamport-cordova';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MyApp } from './app.component';
import { initializeApp } from "firebase/app";

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { StarRatingModule } from 'ionic3-star-rating';
import { MypagePage} from './../pages/mypage/mypage'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { DeliveryAreaPage } from '../pages/delivery-area/delivery-area';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { HttpModule } from '@angular/http';
import { ChatPage } from '../pages/chat/chat';
import { CameraselectPage } from './../pages/cameraselect/cameraselect'
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
// import { ChatroomlistPage } from '../pages/chatroomlist/chatroomlist';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { SettingPage } from '../pages/setting/setting';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CoinSavePage } from '../pages/coin-save/coin-save';
import { HttpClientModule } from '@angular/common/http';
import { TspagePage } from '../pages/tspage/tspage';
import { DepositPage } from '../pages/deposit/deposit';
import { PeripheralPage } from '../pages/peripheral/peripheral';
import { DiscountPage } from '../pages/discount/discount';
import { ConfirmPage } from '../pages/confirm/confirm';
import { HomeslidePage } from '../pages/homeslide/homeslide';


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
initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    MypagePage,
    LoginpagePage,
    ChatPage,
    SettingPage,
    DeliveryAreaPage,
    CameraselectPage,
    CoinSavePage,
    TspagePage,
    DepositPage,
    PeripheralPage,
    DiscountPage,
    ConfirmPage,
    HomeslidePage,
    // ChatroomlistPage,
  ],
  imports: [
    BrowserModule,
    StarRatingModule,
    IonicModule.forRoot(MyApp),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginpagePage,
    SettingPage,
    MypagePage,
    ChatPage,
    DeliveryAreaPage,
    CameraselectPage,
    CoinSavePage,
    TspagePage,
    DepositPage,
    PeripheralPage,
    DiscountPage,
    ConfirmPage,
    HomeslidePage,
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
    PhotoViewer,
    Keyboard,
    UniqueDeviceID,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
