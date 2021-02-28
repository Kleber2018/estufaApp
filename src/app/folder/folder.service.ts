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
  getMedicao(ip:string, token: string){
   let param: any = {token: token};
    return this.http.get<any>('http://'+ ip +'/medicao',{headers: this.headers}).toPromise();
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
