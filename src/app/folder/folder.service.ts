import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

//import { NetworkInterface } from '@ionic-native/network-interface';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  public  apiURL = '192.168.0.105:5000'
  // public  apiURL = 'http://127.0.0.1:5000'

  public headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

  constructor(private http : HttpClient) {
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }
  }


  getMedicoes(inicial, final){

    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }

    const inicialSplit = inicial.split('T')
    const finalSplit = final.split('T')

    //this.ocultarMedicoes([2,4])

   // let param: any = {datainicial: '2020-12-13', datafinal: '2020-12-20'};
    let param: any = {datainicial: inicialSplit[0]+' 00:01', datafinal: finalSplit[0]+' 23:59'};
    return this.http.get<any>('http://'+this.apiURL+'/medicao',{headers: this.headers, params: param}).toPromise();
  }


  ocultarMedicao(id){
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }

    let param: any = {id: id};

    return this.http.get<any>('http://'+ this.apiURL+'/apiocultarmedicoes',{headers: this.headers, params: param}).toPromise();
  }


  getAlertas(){
    this.apiURL = localStorage.getItem('ipraspberry')
    return this.http.get<any>('http://'+this.apiURL+'/alertas',{headers: this.headers}).toPromise();
  }

  silenciarAlertas() {
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }

    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    return this.http.get<any>('http://'+this.apiURL+'/silenciaralertasapi',{headers: this.headers}).toPromise() ;
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
