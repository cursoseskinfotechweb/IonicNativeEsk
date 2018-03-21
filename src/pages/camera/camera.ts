import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  photoUri: string;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
  }

  onActionSheet(): void {
    this.actionSheetCtrl.create({
      title: 'Select image source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel'
        }
      ]
    }).present();
  }

  takePicture(sourceType: number): void {

    let cameraOptions: CameraOptions = {
      correctOrientation: true,
      quality: 100,
      saveToPhotoAlbum: false,
      sourceType: sourceType
    };

    this.camera.getPicture(cameraOptions)
      .then((fileUri: string) => {
        console.log('Photo: ', fileUri);
        this.photoUri = fileUri;
      }).catch((error: Error) => console.log('Camera error: ', error));
  }
}
