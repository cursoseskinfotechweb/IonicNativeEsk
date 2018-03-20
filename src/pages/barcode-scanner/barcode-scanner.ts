import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-barcode-scanner',
  templateUrl: 'barcode-scanner.html',
})
export class BarcodeScannerPage {

  barcodeResult: BarcodeScanResult;

  constructor(
    public barcodeScanner: BarcodeScanner,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
  }

  onGetBarcode(): void {
    this.barcodeScanner.scan()
      .then((barcodeResult: BarcodeScanResult) => {
        this.barcodeResult = barcodeResult;
        console.log('BarcodeScanner result: ', barcodeResult);
      }).catch((error: Error) => {
        console.log('BarcodeScanner Error: ', error);
      });
  }

}
