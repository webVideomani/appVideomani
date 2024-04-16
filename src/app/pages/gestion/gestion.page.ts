import {Component, OnInit} from '@angular/core';
import {DatosService} from "../../services/datos.service";
import {Preferences} from "@capacitor/preferences";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
})
export class GestionPage implements OnInit {

  constructor(private datosService: DatosService,
              private alertController: AlertController,
              private router: Router) { }

  ruta: any

  ngOnInit() {
    this.rutaCrear()
  }

  private async rutaCrear() {
    let cif: any
    await Preferences.get({key: 'cif'}).then(data => cif = data.value)
    let uid: any
    await Preferences.get({key: 'uid'}).then(data => uid = data.value)
    await this.datosService.construirRuta(cif, uid).then(res => {
      this.ruta = res
    })
  }

  private logOut(){
    Preferences.remove({key: 'cif'})
    Preferences.remove({key: 'uid'})
    this.router.navigateByUrl('/inicio')
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¿Quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.logOut()
          },
        },
      ],
    });

    await alert.present();
  }

}
