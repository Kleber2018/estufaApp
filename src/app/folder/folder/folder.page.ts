import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FolderService} from "../folder.service";
import { GoogleChartInterface } from 'ng2-google-charts';
import {forEachComment} from "tslint";

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

  constructor(private activatedRoute: ActivatedRoute,
              private folderService: FolderService) {

  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.buscarMedicoes();
  }

  async buscarMedicoes() {
    this.medicoes = await this.folderService.getMedicoes().then(medicoesRetorno => {
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

}
