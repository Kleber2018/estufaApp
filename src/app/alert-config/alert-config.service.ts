import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertConfigService {
  public  apiURL = '192.168.0.105:5000'
  public headers = new HttpHeaders()
      .set('Content-Type', 'application/json');


  constructor(private http : HttpClient) { }

  getConfig(ip: string){
   // let param: any = {token: token};
    return this.http.get<any>('http://'+ ip+'/apiconfig',{headers: this.headers}).toPromise();
  }

  updateConfig(configuracao: any, ip: string, token: string){
    let param: any = {token: token};
    return this.http.post<any>('http://'+ ip +'/apisalvarconfig',{headers: this.headers,  params: configuracao}).toPromise();
  }
}
