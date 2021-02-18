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


  async validaDispositivo(ip) {
    const retorno = await this.http.get<any>('http://'+ ip + ':5000' + '/scan', {headers: this.headers}).toPromise().then(r => {
      return r
    }).catch(erro => {
    //  console.log(erro)
      return false;
    });

    if (retorno) {
      if (retorno.retorno) {
        return retorno.retorno
      } else {
        return false
      }
    } else {
      return false
    }
  }

/*
  async scanDispositivo(ipCompleto) {
    var ipArray = ipCompleto.ip.split('.')
    var ip = ipArray[0]+'.'+ipArray[1]+'.'+ipArray[2]
    var retorno

    for (let j = 100; j < 254; j++) {
      console.log('http://'+ ip + '.' + j + ':5000' + '/scan')
      retorno = await this.http.get<any>('http://'+ ip + '.' + j + ':5000' + '/scan', {headers: this.headers}).toPromise().then(r => {
        return r
      }).catch(erro => {
        console.log(erro)
      });

      if (retorno) {
        if (retorno.retorno) {
          localStorage.setItem('ipraspberry', retorno.retorno+':5000')
          j = 255;
          this.apiURL = retorno.retorno
          return true
        }
      }
    }
    alert('Não encontrado na rede: '+ ipCompleto)
    return false
  }
*/
  async getDateTimeRaspberry(){
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }
    const retorno = await this.http.get<any>('http://'+ this.apiURL + '/scan', {headers: this.headers}).toPromise().then(r => {
      return r
    }).catch(erro => {
      console.log(erro)
    });

    if (retorno) {
      if (retorno.datetime) {
        return retorno.datetime
      } else {
        return false
      }
    } else {
      return false
    }
  }

  //alterar a data time do raspberry // "Mon Aug 28 20:10:11 UTC-3 2019"
  async setDateTimeRaspberry(){
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }

    var nowArray = new Date().toString().split(" ", 5)
    // Mon Aug 28 20:10:11 UTC-3 2019
   // var nowString = nowArray[0]+' '+nowArray[1]+' '+nowArray[2]+' '+nowArray[4]+' UTC-3 '+ nowArray[3]

    let param: any = {datetime: nowArray[0]+' '+nowArray[1]+' '+nowArray[2]+' '+nowArray[4]+' UTC-3 '+ nowArray[3]};
    //param = {datetime: new Date().toString()}
    console.log('param', param)
    const retorno = await this.http.get<any>('http://'+ this.apiURL + '/updatedatasistema', {headers: this.headers, params: param}).toPromise().then(r => {
      return r
    }).catch(erro => {
      console.log(erro)
    });

    if (retorno) {
      if (retorno.datetime) {
        return retorno.datetime
      } else {
        return false
      }
    } else {
      return false
    }
  }

}
