export interface Config {
  guarda?: string;
  vibrar?: string; //0/1
  toque?: string; ///da lsita de toques do alerta
  modulos?: [Modulo];
 }


 export interface Modulo {
    identificacao?: string; //Estufa Amarela
    guarda?: string; // 1 / 0
    usuario?: string; // para login
    token?: string; // retornado pelo raspberry
    created?: any; // data da criação
    ip?: string; // 192.168.1.105:5000
    alertaParams?:{
      id_config?: string;
      intervalo_seconds?: number;
      obs?: string;
      temp_max?: number;
      temp_min?: number;
      umid_max?: number;
      umid_min?: number;
      updated?: any
    }
 }
