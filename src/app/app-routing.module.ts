import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {TabsComponent} from "./components/tabs/tabs.component";
import {DatosService} from "./services/datos.service";
import * as path from "path";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'contacto/express',
    loadChildren: () => import('./pages/contacto/contacto.module').then( m => m.ContactoPageModule)
  },
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'contacto',
        loadChildren: () => import('./pages/contacto/contacto.module').then( m => m.ContactoPageModule)
      },
      {
        path: 'gestion',
        loadChildren: () => import('./pages/gestion/gestion.module').then( m => m.GestionPageModule)
      },

    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
