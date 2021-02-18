import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-modal-scan',
  templateUrl: './modal-scan.page.html',
  styleUrls: ['./modal-scan.page.scss'],
})
export class ModalScanPage implements OnInit {

  public formIP: FormGroup;

  @Input() IP : string;
  public scanDispositivo = false
  public dispositivosIp = []

  constructor(public modalController: ModalController,
    private formBuilder: FormBuilder,
    private networkInterface: NetworkInterface,
    private configService: ConfigService,
    public alertController: AlertController) {   }

  ngOnInit() {
    console.log('construtor do modal: ', this.IP)
    this.buildFormIP(this.IP)
  }

  dismiss(ipRetorno?: string) {
    console.log('dimiss', ipRetorno)
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    if(ipRetorno){
      this.modalController.dismiss({
        'closed': false,
        'IP' : ipRetorno
      });
    } else {
      this.modalController.dismiss({
        'closed': true
      });
    }
    
  }


  resetarIP(){
    this.networkInterface.getWiFiIPAddress()
            .then(address => {
                console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`); 
                var ipArray = address.ip.split('.')
                this.buildFormIP(ipArray[0]+'.'+ipArray[1]+'.'+ipArray[2]+'.XXX');
            })
            .catch(error => {
              console.error(`Unable to get IP1: ${error}`)
              this.buildFormIP("127.0.0.1");
            });

    this.networkInterface.getCarrierIPAddress()
        .then(address => {
            console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`); 
            var ipArray = address.ip.split('.')
            this.buildFormIP(ipArray[0]+'.'+ipArray[1]+'.'+ipArray[2]+'.XXX');
            })
        .catch(error => {
          console.error(`Unable to get IP2: ${error}`)
          this.buildFormIP("127.0.0.1");
        });
  }


  buildFormIP(ip){
    console.log('construindo form ip', ip)
    this.formIP = this.formBuilder.group({
        ip: [ip, [Validators.required]]
    })
  }

  async submitIP(){
    const r = await this.configService.validaDispositivo(this.formIP.value.ip)
    if(r){
      console.log('retornou do dispositvo', r)
      this.dismiss(this.formIP.value.ip)
    } else {

      const alert = await this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Alerta',
        subHeader: 'IP Não encontrado',
        message: 'Continuar mesmo assim?',
        buttons: [{
          text: 'Voltar',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Salvar',
          handler: () => {
            this.dismiss(this.formIP.value.ip)
          }
        }]
      });
  
      await alert.present();
    }
  }


  public indexScan = 100

  async promiseScanRede() {
    this.dispositivosIp = []
    this.scanDispositivo = true
    var ipArray = this.formIP.value.ip.split('.')
    var ip = ipArray[0]+'.'+ipArray[1]+'.'+ipArray[2]
    this.indexScan = 0
    for (this.indexScan; this.indexScan < 254; this.indexScan++) {
      console.log('http://'+ ip + '.' + this.indexScan + ':5000' + '/scan')
      const r = await this.configService.validaDispositivo(ip + '.' + this.indexScan)
      if(r){
        this.scanDispositivo = false
        console.log('if', r)
        this.indexScan = 255
        this.dispositivosIp.push(r)
        localStorage.setItem('ipraspberry', r+':5000')
      }
    }
  }

  async SyncScanRede() {
    this.dispositivosIp = []
    this.scanDispositivo = true
    var ipArray = this.formIP.value.ip.split('.')
    var ip = ipArray[0]+'.'+ipArray[1]+'.'+ipArray[2]
    this.indexScan = 0
    for (this.indexScan; this.indexScan < 254; this.indexScan++) {
      console.log('http://'+ ip + '.' + this.indexScan + ':5000' + '/scan')
      this.configService.validaDispositivo(ip + '.' + this.indexScan).then( r => {
        console.log('asincrono ', r)
        if(r){
          console.log('if', r)
          this.dispositivosIp.push(r)
        }
      })
    }

    setTimeout(() => {
      this.scanDispositivo = false;
    },
    50000);

  }

  pararScanRede(){
    this.indexScan = 255
    this.scanDispositivo = false
  }
}
