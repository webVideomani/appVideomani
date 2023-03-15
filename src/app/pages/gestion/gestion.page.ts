import {Component, OnInit} from '@angular/core';
import {DatosService} from "../../services/datos.service";

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
})
export class GestionPage implements OnInit {

  constructor(private datosService: DatosService) { }

  ruta: any

  ngOnInit() {
    this.rutaCrear()
  }

  async rutaCrear(){
    this.datosService.construirRuta(await this.datosService.storage.get('cif'), await this.datosService.storage.get('uid')).then(res => {
      this.ruta = res
    })
  }


}
