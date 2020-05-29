import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ViewController } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the HomeslidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-homeslide',
  templateUrl: 'homeslide.html',
})
export class HomeslidePage {
  @ViewChild(Slides) slidess: Slides;
  firemain = firebase.database().ref();
  slides = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
    localStorage.setItem("firstflag","false");
    this.firemain.child("explainpage").once("value", (snapshot) => {

      for (var a in snapshot.val()) {
        this.slides.push(snapshot.val()[a])
        console.log(this.slides);
      }
    })
  }
  
  onClick(){
    console.log("close");
    // this.navCtrl.push(HomePage);
    this.viewCtrl.dismiss();
  }

}
