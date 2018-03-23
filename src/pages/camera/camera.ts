import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  photoUri: string;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public file: File,
    public filePath: FilePath,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform
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
        console.log('File URI: ', fileUri);
        this.photoUri = fileUri;

        this.correctPathAndGetFileName(fileUri, sourceType)
          .then(data => {
            console.log('Corrigido: ', data);
          })

      }).catch((error: Error) => console.log('Camera error: ', error));
  }

  private correctPathAndGetFileName( fileUri: string, sourceType: number ): Promise<{ oldFilePath: string, oldFileName: string }> {
    
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      return this.filePath.resolveNativePath(fileUri)
        .then((correctFileUri: string) => {
          return {
            oldFilePath: correctFileUri.substr(0, (correctFileUri.lastIndexOf('/') + 1)),
            oldFileName: fileUri.substring(
              fileUri.lastIndexOf('/')+1, 
              fileUri.lastIndexOf('?') 
            )
          }
        })
        .catch((error: Error) => {
          let errorMsg: string = 'Error ao corrigir path no Android: ' 
          console.log(errorMsg, error)
          return Promise.reject(errorMsg)
        });
    }

    return Promise.resolve({
      oldFilePath: fileUri.substr(0, (fileUri.lastIndexOf('/') + 1)),
      oldFileName: fileUri.substr(fileUri.lastIndexOf('/') + 1) 
    })
  }

}
