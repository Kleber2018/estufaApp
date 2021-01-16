import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
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

  getConfig(){
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    return this.http.get<any>(this.apiURL+'/apiconfig',{headers: headers}).toPromise();
  }

  updateConfig(configuracao: any){
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    //let param: any = {datainicial: inicialSplit[0]+' 00:01', datafinal: finalSplit[0]+' 23:59'};

    return this.http.post<any>(this.apiURL+'/apisalvarconfig',{headers: headers,  params: configuracao}).toPromise();
  }

}
