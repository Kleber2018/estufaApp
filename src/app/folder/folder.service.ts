import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http : HttpClient) { }

  getMedicoes(){
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
  console.log('192.168.0.105:8080/medicao')
    return this.http.get(`http://192.168.0.105:8080/medicao`, {headers: headers}).toPromise();
  }

  /*getMedicoes(){
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', token.token);

    let param: any = {'id': id};

    return this.http.get(`${apiURL}/ocurrences/${id}`, {headers: headers}).toPromise();
  }*/
}
