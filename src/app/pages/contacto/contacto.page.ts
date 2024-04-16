import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, ToastController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatosService} from "../../services/datos.service";
import {MensajeRegistrado} from "../../interfaces/mensajeRegistrado/mensaje-registrado";
import {MensajeNoRegistrado} from "../../interfaces/mensajeNoRegistrado/mensaje-no-registrado";
import {Preferences} from "@capacitor/preferences";

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {
  ruta: any = this.contactoExpress() ? '/inicio' : '/gestion';
  toastMensajeError: any
  toastMensajeOK: any = 'Mensaje enviado'
  constructor(
    private router: Router,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private datosService: DatosService) { }

  formGroup: FormGroup = this.formBuilder.group({
    correo:['', [Validators.required, Validators.pattern(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i),]], //pattern de correo
    tlf:['', [Validators.required, Validators.pattern(/^[0-9]+$/)]], //pattern de num. de tlf.
    comentario:['', [Validators.required]],
    nombre:['', [Validators.required, Validators.pattern(/^[A-Za-z\s]*$/)]],
    apellidos:['', [Validators.required, Validators.pattern(/^[A-Za-z\s]*$/)]],
  })
  ngOnInit() {
  }

  contactoExpress(){
    return this.router.url == '/contacto/express'
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¿Quieres enviar este aviso?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.enviar()
          },
        },
      ],
    });

    await alert.present();
  }

  async enviar(){
    let reg: boolean = false

    if (!this.contactoExpress()){
      this.formGroup.removeControl('nombre')
      this.formGroup.removeControl('apellidos')
      this.formGroup.removeControl('correo')
      this.formGroup.removeControl('tlf')
      this.toastMensajeError = 'Mensaje vacío'
      reg = true
    }
    else {
      this.toastMensajeError = 'Campos inválidos o vacíos'
    }

    if (this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
      await this.presentToast(this.toastMensajeError)
      return
    }

    else {
        if (reg) {
          let cif: any
          await Preferences.get({key: 'cif'}).then(data => cif = data.value)
          let uid: any
          await Preferences.get({key: 'uid'}).then(data => uid = data.value)
          this.datosService.postMensajeRegistrado(
            await this.datosService.construirRutaPostRegistrado(
              cif,uid
              /*await this.datosService.storage.get('cif'),
              await this.datosService.storage.get('uid')*/),
            this.formGroup.controls['comentario'].value).subscribe(data => console.log(data))

          /*let cif: string
          let mensaje:  string = this.formGroup.controls['comentario'].value
          this.datosService.storage.get('cif').then(res => {
            cif = res
            let mensajeRegistrado: MensajeRegistrado = {
              cif: cif,
              mensaje: mensaje
            }
            this.datosService.postSoapMensajeRegistrado(mensajeRegistrado).subscribe(data => {
              this.presentToast(data)
              console.log(data)
              this.presentAlert()
            })
          })*/
        } else {
          this.datosService.postMensajeNoRegistrado(
            await this.datosService.construirRutaPostNoRegistrado(
              this.formGroup.controls['tlf'].value),
            this.construirMensaje()
          ).subscribe(data => console.log(data))

          /*
          let tlf: string = this.formGroup.controls['tlf'].value
          let mensaje: string = this.construirMensaje()
          let mensajeNoRegistrado: MensajeNoRegistrado = {
            telefono: tlf,
            mensaje: mensaje
          }
          this.datosService.postSoapMensajeNoRegistrado(mensajeNoRegistrado).subscribe(data => {
            this.presentToast(data)
            console.log(data)
            this.presentAlert()
          })*/
        }
      await this.presentToast(this.toastMensajeOK)
      await this.router.navigateByUrl(this.ruta)
      return;
    }

}


  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: 3000,
        position: 'bottom',
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
          }
        ]
    });
    await toast.present();
  }

  private construirMensaje(){
    let msg: string = '';
    msg = msg.concat(this.formGroup.controls['nombre'].value + ' ' + this.formGroup.controls['apellidos'].value + '\n\n')
    msg = msg.concat(this.formGroup.controls['correo'].value + '\n\n')
    msg = msg.concat(this.formGroup.controls['comentario'].value)
    return msg
  }
}
