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
