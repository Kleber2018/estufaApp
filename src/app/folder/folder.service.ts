import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

//import { NetworkInterface } from '@ionic-native/network-interface';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
 // public  apiURL = 'http://192.168.0.105:5000'
  public  apiURL = 'http://127.0.0.1:5000'
  constructor(private http : HttpClient,
              //private networkInterface: NetworkInterface
  ) {

  }

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


  getMedicoes(inicial, final){
   // this.apiURL = localStorage.getItem('ipraspberry')

    if(!this.apiURL){
      this.scanDispositivo();
    }

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const inicialSplit = inicial.split('T')
    const finalSplit = final.split('T')

    //this.ocultarMedicoes([2,4])

   // let param: any = {datainicial: '2020-12-13', datafinal: '2020-12-20'};
    let param: any = {datainicial: inicialSplit[0]+' 00:01', datafinal: finalSplit[0]+' 23:59'};
    return this.http.get<any>(this.apiURL+'/medicao',{headers: headers, params: param}).toPromise();
  }


  ocultarMedicoes(ids){
    // this.apiURL = localStorage.getItem('ipraspberry')

    if(!this.apiURL){
      this.scanDispositivo();
    }

    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    // let param: any = {datainicial: '2020-12-13', datafinal: '2020-12-20'};
    let param: any = {id_medicao: ids};
    return this.http.post<any>(this.apiURL+'/apiocultarmedicoes',{headers: headers, params: param}).toPromise();
  }


  getAlertas(){
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    return this.http.get<any>(this.apiURL+'/alertas',{headers: headers}).toPromise();
  }

  silenciarAlertas() {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    return this.http.get<any>(this.apiURL+'/silenciaralertasapi',{headers: headers}).toPromise() ;
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
