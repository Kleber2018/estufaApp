import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  public  apiURL = '192.168.0.105:5000'
  // public  apiURL = 'http://127.0.0.1:5000'

  public headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

  constructor(private http : HttpClient) {
  }


  // para ter a medição mais atualizada para mostrar no header
  getMedicao(ip:string, ){
   //let param: any = {token: token};
    return this.http.get<any>('http://'+ ip +'/medicao',{headers: this.headers}).toPromise();
  }




  async validaIP(ip){
    const retorno = await this.http.get<any>('http://'+ ip + '/scan', {headers: this.headers}).toPromise().then(r => {
      return r
    }).catch(erro => {
      console.log(erro)
    });
    if (retorno) {
      if (retorno.retorno) {
        //localStorage.setItem('ipraspberry', retorno.retorno + ':5000')
        const ip = retorno.retorno
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }


  async validaDispositivo(ip) {
    const retorno = await this.http.get<any>('http://'+ ip + '/scan', {headers: this.headers}).toPromise().then(r => {
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


  async login(ip, user, senha){
    let body = JSON.stringify( {user: user, senha: senha})
   // console.log('param', param)
    const retorno = await this.http.post<any>('http://'+ ip + '/loginapi', body, {headers: this.headers}).toPromise().then(r => {
      return r
    }).catch(erro => {
      console.log(erro)
    });

    console.log('retornou ', retorno)
    if (retorno) {
      return retorno
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
  async getDateTimeRaspberry(ip){
    const retorno = await this.http.get<any>('http://'+ ip + '/scan', {headers: this.headers}).toPromise().then(r => {
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
  async setDateTimeRaspberry(ip, token){
    var nowArray = new Date().toString().split(" ", 5)
    // Mon Aug 28 20:10:11 UTC-3 2019
   // var nowString = nowArray[0]+' '+nowArray[1]+' '+nowArray[2]+' '+nowArray[4]+' UTC-3 '+ nowArray[3]
    let param: any = {datetime: nowArray[0]+' '+nowArray[1]+' '+nowArray[2]+' '+nowArray[4]+' UTC-3 '+ nowArray[3], token: token};
    //param = {datetime: new Date().toString()}
    const retorno = await this.http.get<any>('http://'+ ip + '/updatedatasistema', {headers: this.headers, params: param}).toPromise().then(r => {
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


  getConfig(ip: string){
    // let param: any = {token: token};
    return this.http.get<any>('http://'+ ip+'/apiconfig',{headers: this.headers}).toPromise();
  }
 
  updateConfig(configuracao: any, ip: string, token: string){
    let body = JSON.stringify( {token: token, config: configuracao})
    return this.http.post<any>('http://'+ ip +'/apisalvarconfig', body ,{headers: this.headers}).toPromise();
  }
}






/*
getOccurrence(id: string) {
  const apiURL = localStorage.getItem('urlServidor')
      ? JSON.parse(localStorage.getItem('urlServidor'))
      : null;

  const token =  sessionStorage.getItem('userEquipe2token')
      ? JSON.parse(sessionStorage.getItem('userEquipe2token'))
      : null;

  const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token.token);

  let param: any = {'id': id};

  return this.http.get(`${apiURL}/ocurrences/${id}`, {headers: headers}).toPromise();
}
  /*
getMedicoes(){
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', token.token);

    let param: any = {'id': id};

    return this.http.get(`${this.apiURL}/ocurrences/${id}`, {headers: headers}).toPromise();
}*/
