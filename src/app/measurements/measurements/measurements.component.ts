import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MeasurementsService } from '../measurements.service';
import { Config, Modulo } from 'src/app/shared/model/config.model';

import { Chart } from 'chart.js';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { GoogleChartInterface } from 'ng2-google-charts';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.scss'],
})
export class MeasurementsComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();
  lineChart: any;

  public admin: boolean = false;

  public folder: string;
  public medicoes: any = [];
  public alertas: any = [];

  public config: any;

  public medicao = {
    temp: 0,
    temp_status: '',//baixo, alto
    umid: 0,
    umid_status: '' //baixo, alto
  }

  public dadosModulo : Modulo;

  customPickerOptions: any;

  public dataInic = (new Date().getFullYear())+'-'+(new Date().getMonth())+'-'+(new Date().getDate()-2)
  public formDataInic = new FormControl(this.dataInic,[]);

  public dataFinal = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate())
  public formDataFinal = new FormControl(this.dataFinal,[]);


  @ViewChild('alertaPiscando', { read: ElementRef }) alertaPiscando: ElementRef;
  @ViewChild('umidAnimation', { read: ElementRef }) umidAnimation: ElementRef;
  @ViewChild('tempAnimation', { read: ElementRef }) tempAnimation: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
                    private router: Router,
                    private measurementsService: MeasurementsService,
                    private pdfGenerator: PDFGenerator
                    ) {
    this.admin = false
    this.customPickerOptions = {
      buttons: [{
        text: 'Buscar',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Log',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    }


    if (this.activatedRoute.snapshot.params.id) {
      const configMod: Config = localStorage.getItem('estufaapp')
          ? JSON.parse(localStorage.getItem('estufaapp'))
          : null;
      if(configMod){
          this.dadosModulo =  configMod.modulos[this.activatedRoute.snapshot.params.id]
          let interval = 60
          if(this.dadosModulo.measurements){
            if(this.dadosModulo.measurements.intervalo){
              interval = this.dadosModulo.measurements.intervalo
            }
          }
          var d = new Date();
          d.setDate(d.getDate() - interval);
          this.dataInic = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          this.formDataInic = new FormControl(this.dataInic, []);
          this.buscarMedicoes(this.dataInic, this.dataFinal, this.dadosModulo.ip)
      }
  }



    //this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    //range de dias

    
  }


  ngOnInit() {  }

    
  selecionadoData(){
    this.buscarMedicoes(this.formDataInic.value, this.formDataFinal.value, this.dadosModulo.ip)
  }
  
  public teste = 'testando'
  gerarPDF(){
    let options = {
      documentSize: 'A4',
      type: 'share',
      fileName: 'myFile.pdf'
    }

    var pdfhtml = '<html><body style="font-size:120%"><canvas #lineCanvas style="width:97vw; height: 280px; "></canvas><p>teste</p></body></html>';

    this.pdfGenerator.fromData( pdfhtml, options)
    .then((stats)=> console.log('status', stats) )   // ok..., ok if it was able to handle the file to the OS.  
    .catch((err)=>console.log(err))
  }


  async buscarMedicoes(dataI, dataF, ip) {
    this.medicoes = await this.measurementsService.getMedicoes(dataI, dataF, '0,0,1,1', ip).then(medicoesRetorno => {
      return medicoesRetorno
    }).catch(error => {
      console.log('Retornou Erro de Medições:', error);
    })
    var dadosGrafico = [['Data', 'Umidade', 'Temperatura']]
    console.log(this.medicoes)

    if (this.medicoes){
      this.medicoes.sort((a, b) => {
        return +a.id - +b.id;
      });
      var temperaturas = []
      var umidades = []
      var datas = []

      this.medicoes.forEach(medicao => {
        dadosGrafico.push([new Date(medicao.Data).getHours() + ":"+ new Date(medicao.Data).getMinutes(), medicao.Umidade, medicao.Temperatura])
        temperaturas.push(medicao.Temperatura)
        umidades.push(medicao.Umidade)
        datas.push(new Date(medicao.Data).getDay()+ " - " + new Date(medicao.Data).getHours() + ":"+ new Date(medicao.Data).getMinutes())
//      console.log(new Date(medicao.Data).getHours() + ":"+ new Date(medicao.Data).getMinutes())
      })
      this.lineChartMethod(temperaturas, umidades, datas);
    }
  }

  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  lineChartMethod(temps, umids, dats) {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: dats, //['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'], //{{ dias | tojson }},
        datasets: [{
          label: 'Temperatura',
          data: temps, //[2, 3, 4, 5, 3, 3, 3, 3, 3, 3, 2], //{{ temperaturas | tojson }},
        backgroundColor: 'rgb(255,254,254, 0)',
            borderColor: 'rgb(193,17,17)',
            borderWidth: 1
      },
        {
          label: 'Umidade',
          data:  umids, //[2, 3, 4, 5, 3, 3, 3, 3, 3, 3, 2], //{{ umidades | tojson }},
          backgroundColor: 'rgb(246,246,245, 0)',
          borderColor: 'rgb(13,61,208)',
          borderWidth: 1
        }]
      },
        options: {
          responsive: true,
              title: {
            display: true,
                text: 'Medições de Temperatura e Umidade'
          },
          hover: {
            mode: 'nearest',
                intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Horário'
              }
            }],
                yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Fº / %'
              }
            }]
          }
        }
    });
  }

  deletarMedicao(id: string){
    this.measurementsService.ocultarMedicao(id, this.dadosModulo.ip, this.dadosModulo.token).then( r => {
      this.buscarMedicoes(this.formDataInic.value, this.formDataFinal.value, this.dadosModulo.ip)
    })
  }


  habilitaDelete(status: boolean){
    this.admin = status
  }


   //para fazer um refresh
  doRefresh(event) {
    const configMod: Config = localStorage.getItem('estufaapp')
            ? JSON.parse(localStorage.getItem('estufaapp'))
            : null;
    if(configMod){
      this.dadosModulo =  configMod.modulos[this.activatedRoute.snapshot.params.id]
      this.buscarMedicoes(this.formDataInic.value, this.formDataFinal.value, this.dadosModulo.ip)
    }
    setTimeout(() => {
      event.target.complete();
    }, 400);
  }

  ngOnDestroy(): void {
    console.log('onDestroy')
    this.end.next();
    this.end.complete();
  }
}
