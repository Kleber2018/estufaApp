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
    measurements?: {
      intervalo?: number
      data_inic?: any;
      data_fim?: any;
    }
 }


 
 export interface ConfigIntervalo {
  id_config?: string; 
  etapa?: string; 
  intervalo_seconds?: string; 
  temp_min?: string; 
  temp_max?: string; 
  umid_min?: string; 
  umid_max?: string; 
  updated?: any;  
  obs?: string; 
}