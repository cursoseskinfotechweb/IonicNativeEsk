import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File, Entry } from '@ionic-native/file';

@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  photo: Entry;

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

  private takePicture(sourceType: number): void {

    let cameraOptions: CameraOptions = {
      correctOrientation: true,
      quality: 100,
      saveToPhotoAlbum: false,
      sourceType: sourceType
    };

    this.camera.getPicture(cameraOptions)
      .then((fileUri: string) => {
        console.log('File URI: ', fileUri);

        this.saveFile(fileUri, sourceType)
          .then((entry: Entry) => {
            this.photo = entry;

            console.log('Entry: ', entry);
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

  private createNewFileName(oldFileName: string): string {
    // .pnj .jpg
    let extension: string = oldFileName.substr(oldFileName.lastIndexOf('.'));

    // 1233331222555.jpg
    return new Date().getTime() + extension; 
  }

  private saveFile(fileUri: string, sourceType: number): Promise<Entry> {
    return this.correctPathAndGetFileName(fileUri, sourceType)
      .then((data: {oldFilePath: string, oldFileName: string}) => {

        return this.file.copyFile(
          data.oldFilePath, 
          data.oldFileName, 
          this.file.dataDirectory, 
          this.createNewFileName(data.oldFileName)
        ).catch((error: Error) => {
          let errorMsg: string = 'Erro ao copiar o arquivo: ' ;
          console.log(errorMsg, error)
          return Promise.reject(errorMsg)
        });
      })
      .catch((error: Error) => {
        let errorMsg: string = 'Erro na chamaada do método correctPathAndGetFileName' 
        console.log(errorMsg, error)
        return Promise.reject(errorMsg)
      });
  }
}
