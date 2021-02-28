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


  getAlertas(ip){
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.get<any>('http://'+ ip+'/alertas',{headers: headers}).toPromise();
  }

  getAlertasPeriodo(inicial, final, ip){
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    const inicialSplit = inicial.split('T')
    const finalSplit = final.split('T')
    // let param: any = {datainicial: '2020-12-13', datafinal: '2020-12-20'};
    let param: any = {datainicial: inicialSplit[0]+' 00:01', datafinal: finalSplit[0]+' 23:59'};
    return this.http.get<any>('http://'+ ip+'/alertasperiodo',{headers: headers, params: param}).toPromise();
  }


  silenciarAlertas(ip) {
    return this.http.get<any>('http://'+ip+'/silenciaralertasapi',{headers: this.headers}).toPromise() ;
  }

}
