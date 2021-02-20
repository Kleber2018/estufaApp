import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public  apiURL = '192.168.0.105:5000'
  public headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
  //public  apiURL = 'http://127.0.0.1:5000'
  constructor(private http : HttpClient) { }


  getAlertas(){
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.get<any>('http://'+ this.apiURL+'/alertas',{headers: headers}).toPromise();
  }

  getAlertasPeriodo(inicial, final){
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    const inicialSplit = inicial.split('T')
    const finalSplit = final.split('T')

    //this.ocultarMedicoes([2,4])

    // let param: any = {datainicial: '2020-12-13', datafinal: '2020-12-20'};
    let param: any = {datainicial: inicialSplit[0]+' 00:01', datafinal: finalSplit[0]+' 23:59'};
    return this.http.get<any>('http://'+ this.apiURL+'/alertasperiodo',{headers: headers, params: param}).toPromise();
  }

}
