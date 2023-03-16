import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AlertController, ToastController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatosService} from "../../services/datos.service";
import {HttpClient} from "@angular/common/http";
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  ruta: any = '/gestion'

  hostname = window.location.host
  constructor(
    private router: Router,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private datosService: DatosService,
    private http: HttpClient) { }

  formGroup: FormGroup = this.formBuilder.group({
    cif: ['', [Validators.required]],
    uid: ['', [Validators.required]]
  })
  ngOnInit() {

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        //alert('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        //alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
      }
    )

  }

  enviar(){
    if (this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
      this.presentToast('Campo inválido o vacío')
      return
    }

    this.datosService.construirRutaComprobar(this.cif(), this.uid()).then(res => {
      this.http.get(res).subscribe(data => {
        console.log(data)
        if (data == null){
          this.datosService.setCif(this.cif())
          this.datosService.setUid(this.uid())
          this.presentToast('Campos verificados')
          this.router.navigateByUrl(this.ruta)
          return
        }
      })
    })
    this.presentToast('Campos no verificados')
    return

  }


  cif(){
    return this.formGroup.get('cif')?.value
  }

  uid(){
    return this.formGroup.get('uid')?.value
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

}
