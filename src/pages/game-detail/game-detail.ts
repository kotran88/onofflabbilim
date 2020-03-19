import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import firebase from 'firebase';
// import { PhotoViewer } from '@ionic-native/photo-viewer';

// import { PhotoViewer } from '@ionic-native/photo-viewer';
// import undefined from 'firebase/empty-import';


/**
 * Generated class for the GameDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-game-detail',
  templateUrl: 'game-detail.html',
})
export class GameDetailPage {

  firemain = firebase.database().ref();
  game:any;
  img=[];

  image_viewer(){
    // this.photoViewer.show(this.game.url);
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {

    // this.firemain.child('category').child();
    this.game=this.navParams.get('game');
    console.log(this.game);

    // this.img=this.game.description.controller.split(',');
    // console.log(this.img)
    // for(var i=0;i<this.img.length;i++){
    //   if(String(this.img[i])==='true'){
    //     this.img[i]='https://firebasestorage.googleapis.com/v0/b/bilim-fd9b0.appspot.com/o/switch%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-03-18%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.04.18.png?alt=media&token=1ecf6561-ae31-46b6-8628-912420444da2'
    //     // this.img[i]='https://firebasestorage.googleapis.com/v0/b/bilim-fd9b0.appspot.com/o/switch%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-03-17%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.18.10.png?alt=media&token=102c9fec-964a-4c9c-b4b0-9e7fa17f0705'
    //   }
    //   else{
    //     this.img[i]='https://firebasestorage.googleapis.com/v0/b/bilim-fd9b0.appspot.com/o/switch%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-03-18%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.03.47.png?alt=media&token=3c9fd577-3344-4784-bfc9-6c563ca193b3'
    //     // this.img[i]='https://firebasestorage.googleapis.com/v0/b/bilim-fd9b0.appspot.com/o/switch%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-03-17%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%205.51.44.png?alt=media&token=23a957fb-310a-4390-bd52-246be71d3543'

    //   }
    // }
  }

  Dismiss(){
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameDetailPage');
  }

}
