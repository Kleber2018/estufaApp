import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeasurementsService {

  public  apiURL = '192.168.0.105:5000'
  // public  apiURL = 'http://127.0.0.1:5000'

  public headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

  constructor(private http : HttpClient) {
  }

 //retorna lista de todas as medições filtradas pela data e oculto
// cod oculto se quiser todas é 0,1,2,3, somente com código 1 e 2 usar 1,1,2,2
  getMedicoes(inicial, final, oculto, ip){
      const inicialSplit = inicial.split('T')
      const finalSplit = final.split('T')

    // let param: any = {datainicial: '2020-12-13', datafinal: '2020-12-20'};
      let param: any = {datainicial: inicialSplit[0]+' 00:01', datafinal: finalSplit[0]+' 23:59', oculto: oculto};
      return this.http.get<any>('http://'+ip+'/medicoes',{headers: this.headers, params: param}).toPromise();
  }




  ocultarMedicao(id, ip, token){
    if(localStorage.getItem('ipraspberry')){
      this.apiURL = localStorage.getItem('ipraspberry')
    }

    let param: any = {id: id, token: token};

    return this.http.get<any>('http://'+ ip+'/apiocultarmedicoes',{headers: this.headers, params: param}).toPromise();
  }
}
