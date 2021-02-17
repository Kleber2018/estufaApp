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
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }
  }

 //retorna lista de todas as medições filtradas pela data e oculto
// cod oculto se quiser todas é 0,1,2,3, somente com código 1 e 2 usar 1,1,2,2
  getMedicoes(inicial, final, oculto){
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }

    const inicialSplit = inicial.split('T')
    const finalSplit = final.split('T')

   // let param: any = {datainicial: '2020-12-13', datafinal: '2020-12-20'};
    let param: any = {datainicial: inicialSplit[0]+' 00:01', datafinal: finalSplit[0]+' 23:59', oculto: oculto};
    return this.http.get<any>('http://'+this.apiURL+'/medicoes',{headers: this.headers, params: param}).toPromise();
  }

  // para ter a medição mais atualizada para mostrar no header
  getMedicao(){
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }
    return this.http.get<any>('http://'+this.apiURL+'/medicao',{headers: this.headers}).toPromise();
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
