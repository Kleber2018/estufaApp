import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  public  apiURL = 'http://127.0.0.1:5000'
  constructor(private http : HttpClient) { }


  getMedicoes(inicial, final){
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const inicialSplit = inicial.split('T')
    const finalSplit = final.split('T')

   // let param: any = {datainicial: '2020-12-13', datafinal: '2020-12-20'};
    let param: any = {datainicial: inicialSplit[0]+' 00:01', datafinal: finalSplit[0]+' 23:59'};
    return this.http.get<any>(this.apiURL+'/medicao',{headers: headers, params: param}).toPromise();
  }


  getAlertas(){
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    return this.http.get<any>(this.apiURL+'/alertas',{headers: headers}).toPromise();
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
