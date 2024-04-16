import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage-angular";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Routes} from "@angular/router";
import {MensajeRegistrado} from "../interfaces/mensajeRegistrado/mensaje-registrado";
import {Observable} from "rxjs";
import {MensajeNoRegistrado} from "../interfaces/mensajeNoRegistrado/mensaje-no-registrado";

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  private headers = new HttpHeaders()
    .set('Content-Type', 'text/xml')
    .set('Accept', '*/*');

  URIComprobar: string = 'https://webservice.salonesdejuegoreplay.com/Gestion/Facturas/ComprobarTitular'
  //URIComprobar: string = 'http://192.168.146.111/Facturas/ComprobarTitular'
  URI: string = 'https://webservice.salonesdejuegoreplay.com/Gestion/Facturas/FacturasTitular'

  post_URI: string = 'https://webservice.salonesdejuegoreplay.com/Gestion/Facturas/InsertarAvisoComercial'
  //post_URI: string = 'http://192.168.146.111/Facturas/InsertarAvisoComercial'

  async construirRuta(cif: string, uid: string){
    /*let cif: string = await this.storage.get('cif')
    let uid: string = await this.storage.get('uid')*/
    return this.URI + '?cif='
      + cif + '&uid='
      + uid
  }

  async construirRutaComprobar(cif: string, uid: string){/*
    let cif: string = await this.storage.get('cif')
    let uid: string = await this.storage.get('uid')*/
    return this.URIComprobar + '?cif='
      + cif + '&uid='
      + uid
  }



  async construirRutaPostRegistrado(cif: string, uid: string){/*
    let cif: string = await this.storage.get('cif')
    let uid: string = await this.storage.get('uid')*/
    return this.post_URI + 'Registrado.aspx?cif=' + cif + '&uid=' + uid
  }


  async construirRutaPostNoRegistrado(tlf: string){/*
    let cif: string = await this.storage.get('cif')
    let uid: string = await this.storage.get('uid')*/
    return this.post_URI + 'NoRegistrado.aspx?telefono=' + tlf
  }

  //private cif: Storage | null = null;
  //private uid: Storage | null = null;

  //private stLength: Number | undefined

  constructor(public storage: Storage, private http: HttpClient) {
    this.init();
  }

  async init() {
    //this.cif = await this.storage['create']();
    //this.uid = await this.storage['create']();
    //this.stLength = await this.storage.length()
  }

  /*public setCif(value: any) {
    this.cif?.['set']('cif', value);
  }

  public setUid(value: any) {
    this.uid?.['set']('uid', value);
  }*/

  postMensajeRegistrado(url: string, mensaje: string): Observable<any> {
    console.log(url)
    return this.http.get<any>(url + '&mensaje=' + mensaje)
  }
  postMensajeNoRegistrado(url: string, mensaje: string): Observable<any> {
    console.log(url)
    return this.http.get<any>(url + '&mensaje=' + mensaje)
  }

  postSoapMensajeRegistrado(mensajeRegistrado: MensajeRegistrado): Observable<any> {
    const xml = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <InsertarAvisoComercialRegistrado xmlns="https://webservice.salonesdejuegoreplay.com/">
            <cif>${mensajeRegistrado.cif}</cif>
            <mensaje>${mensajeRegistrado.mensaje}</mensaje>
          </InsertarAvisoComercialRegistrado>
        </soap:Body>
      </soap:Envelope>
    `;
    return this.http.post(this.post_URI + 'Registrado', xml, {
      headers: this.headers
    });
  }

  postSoapMensajeNoRegistrado(mensajeNoRegistrado: MensajeNoRegistrado): Observable<any> {
    const xml = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <InsertarAvisoComercialNoRegistrado xmlns="https://webservice.salonesdejuegoreplay.com/">
            <telefono>${mensajeNoRegistrado.telefono}</cif>
            <mensaje>${mensajeNoRegistrado.mensaje}</mensaje>
          </InsertarAvisoComercialNoRegistrado>
        </soap:Body>
      </soap:Envelope>
    `;
    return this.http.post(this.post_URI, xml, {
      headers: this.headers,
    });
  }
}
