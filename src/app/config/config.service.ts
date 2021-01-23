import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public  apiURL = '192.168.0.105:5000'
  public headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

  //public  apiURL = 'http://127.0.0.1:5000'
  constructor(private http : HttpClient) { }


  async validaIP(ip){
    const retorno = await this.http.get<any>('http://'+ ip + '/scan', {headers: this.headers}).toPromise().then(r => {
      return r
    }).catch(erro => {
      console.log(erro)
    });

    console.log('fora', retorno)
    if (retorno) {
      if (retorno.retorno) {
        localStorage.setItem('ipraspberry', retorno.retorno + ':5000')
        this.apiURL = retorno.retorno
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  async scanDispositivo() {
    var ip = '192.168.'
    var retorno

    for (let i = 0; i < 2; i++) {
      for (let j = 100; j < 254; j++) {
        console.log(ip + i + '.' + j + ':5000' + '/scan')
        retorno = await this.http.get<any>('http://'+ ip + i + '.' + j + ':5000' + '/scan', {headers: this.headers}).toPromise().then(r => {
          return r
        }).catch(erro => {
          console.log(erro)
        });

        if (retorno) {
          if (retorno.retorno) {
            localStorage.setItem('ipraspberry', retorno.retorno+':5000')
            i = 3;
            j = 255;
            this.apiURL = retorno.retorno
            return true
          }
        }
      }
    }
    return false
  }

  getConfig(){
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }
    return this.http.get<any>('http://'+ this.apiURL+'/apiconfig',{headers: this.headers}).toPromise();
  }

  updateConfig(configuracao: any){
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }
    //let param: any = {datainicial: inicialSplit[0]+' 00:01', datafinal: finalSplit[0]+' 23:59'};
    return this.http.post<any>('http://'+ this.apiURL+'/apisalvarconfig',{headers: this.headers,  params: configuracao}).toPromise();
  }

}
