import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { FolderService } from '../../folder.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class Login implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  public loginForm: any;
  public usuario: any;
  messageEmail = "";
  messageSenha = "";
  erroEmail = false;
  erroSenha = false;

  @Input() IP : string;


  constructor(public modalController: ModalController,
    private formBuilder: FormBuilder,
    private networkInterface: NetworkInterface,
    private folderService: FolderService,
    private toastController:ToastController,
    public alertController: AlertController) {   }

  ngOnInit() {
    console.log('construtor do modal: ', this.IP)
    if(this.IP){
      this.buildFormLogin()
    } else {
      this.buildFormLogin()
    }
   

  }

  dismiss(token?: string) {
    console.log('dimiss', token)
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    if(token){
      this.modalController.dismiss({
        'closed': false,
        'token' : token
      });
      this.ngOnDestroy()
    } else {
      this.modalController.dismiss({
        'closed': true
      });
      this.ngOnDestroy()
    }
  }



  buildFormLogin(){
    this.loginForm = this.formBuilder.group({
      user: ['',Validators.compose([Validators.minLength(2), Validators.required])],
      senha: ['',Validators.compose([Validators.minLength(4),Validators.maxLength(10),Validators.required])]
    })
  }


  async presentToast(mensagem : string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2700,
      position: 'top'
    });
    toast.present();
  }
  

  login(){
    let { user, senha } = this.loginForm.controls;
    if (!this.loginForm.valid) {
      // this.usuarioAutenticado = false;
      if (!user.valid) this.presentToast("Ops! Email ou Usuário inválido");
      if (!senha.valid) this.presentToast("A senha precisa ter de 4 a 10 caracteres")
    } else {
      console.log(this.loginForm.value)

      this.folderService.login(this.IP, this.loginForm.value.user, this.loginForm.value.senha).then(r => {
        console.log('retornou requisição login2', r)
        if(r){
          if(r.token){
            this.dismiss(r.token)
          } else {
            this.presentToast("Usuário ou senha inválido")
          }
        } else {
          this.presentToast("Usuário ou senha inválido")
        }
      }).catch(() =>{
        this.presentToast("Usuário ou senha inválido")
      })
    // this.authService.buscandoTipoProfissional(email.value);//buscando p profissional

   //  const login = this.loginForm.value;
     //this.authService.fazerLogin(login);//faz a busca de autenticação em auth.service.ts
     

    //   console.log(this.authService.ProfissionalNivel);
 
    }
 }


  ngOnDestroy(): void {
    console.log('onDestroy modal')
    this.end.next();
    this.end.complete();
  }
}
