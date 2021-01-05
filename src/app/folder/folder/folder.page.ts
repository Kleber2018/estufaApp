import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FolderService} from "../folder.service";
import { GoogleChartInterface } from 'ng2-google-charts';
import {forEachComment} from "tslint";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public medicoes: any = [];


  public pieChart: GoogleChartInterface;
  /*= {
    chartType: 'LineChart',
    dataTable: [
      ['Task', 'Hours per Day', 'teste'],
      ['Work',     11, 10]
    ],
    //firstRowIsData: true,
    options: {
      'title': 'Tasks',
      curveType: 'function'},
  };*/
  customPickerOptions: any;

  public dataInic = (new Date().getFullYear())+'-'+(new Date().getMonth())+'-'+(new Date().getDate()-2)
  public formDataInic = new FormControl(this.dataInic,[]);

  public dataFinal = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate())
  public formDataFinal = new FormControl(this.dataFinal,[]);

  constructor(private activatedRoute: ActivatedRoute,
              private folderService: FolderService) {

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

    this.folder = this.activatedRoute.snapshot.paramMap.get('id');

    //range de dias
    var intervaloDias = localStorage.getItem('intervaloDias')
        ? JSON.parse(localStorage.getItem('intervaloDias'))
        : null;

    if(!intervaloDias){
      intervaloDias = 6
    }
    var d = new Date();
    d.setDate(d.getDate()-intervaloDias);
    this.dataInic = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()
    this.formDataInic = new FormControl(this.dataInic,[]);

    this.buscarMedicoes(this.dataInic, this.dataFinal)
  }

  ngOnInit() {

  }

  selecionadoData(){
    this.buscarMedicoes(this.formDataInic.value, this.formDataFinal.value)
  }

  async buscarMedicoes(dataI, dataF) {
    this.medicoes = await this.folderService.getMedicoes(dataI, dataF).then(medicoesRetorno => {
      return medicoesRetorno
    }).catch(error => {
      console.log('Retornou Erro de Medições:', error);
    })
    var dadosGrafico = [['Data', 'Umidade', 'Temperatura']]
    console.log(this.medicoes)

    this.medicoes.sort((a, b) => {
      return +a.id - +b.id;
    });

    this.medicoes.forEach(medicao => {
      dadosGrafico.push([new Date(medicao.Data).getHours() + ":"+ new Date(medicao.Data).getMinutes(), medicao.Umidade, medicao.Temperatura])
//      console.log(new Date(medicao.Data).getHours() + ":"+ new Date(medicao.Data).getMinutes())
    })


    this.pieChart = {
      chartType: 'LineChart',
      dataTable: dadosGrafico,
      //firstRowIsData: true,
      options: {
     //   'title': 'Tasks',
        curveType: 'function'},
    };

    this.pieChart.dataTable = dadosGrafico
  }

  fucaoteste(){
    console.log('testando')
  }



}
