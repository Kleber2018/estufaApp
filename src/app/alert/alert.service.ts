import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  //public  apiURL = 'http://192.168.0.105:5000'
  public  apiURL = 'http://127.0.0.1:5000'
  constructor(private http : HttpClient) { }


  async scanDispositivo() {
    var ip = 'http://192.168.'

    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    var retorno

    for (let i = 0; i < 2; i++) {
      for (let j = 100; j < 254; j++) {
        console.log(ip + i + '.' + j + ':5000' + '/scan')
        retorno = await this.http.get<any>(ip + i + '.' + j + ':5000' + '/scan', {headers: headers}).toPromise().then(r => {
          return r
        }).catch(erro => {
          console.log(erro)
        });


        console.log('fora', retorno)
        if (retorno) {
          if (retorno.retorno) {
            localStorage.setItem('ipraspberry', 'http://'+retorno.retorno+':5000')
            i = 3;
            j = 255;
            this.apiURL = retorno.retorno
            return 1
          }
        }
      }
    }
    return 0
  }

  getAlertas(){
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    return this.http.get<any>(this.apiURL+'/alertas',{headers: headers}).toPromise();
  }

  getAlertasPeriodo(inicial, final){

    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    const inicialSplit = inicial.split('T')
    const finalSplit = final.split('T')

    //this.ocultarMedicoes([2,4])

    // let param: any = {datainicial: '2020-12-13', datafinal: '2020-12-20'};
    let param: any = {datainicial: inicialSplit[0]+' 00:01', datafinal: finalSplit[0]+' 23:59'};
    return this.http.get<any>(this.apiURL+'/alertasperiodo',{headers: headers, params: param}).toPromise();
  }

}
