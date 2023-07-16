import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservaListComponent } from './reservas-list/reservas-list.component';
import { EspaciosFisicosListComponent } from './espacios-fisicos-list/espacios-fisicos-list.component';

const routes: Routes = [
  { path: 'reservas', component: ReservaListComponent },
  { path: 'espacios-fisicos', component: EspaciosFisicosListComponent },
  { path: '**', redirectTo: 'reservas' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
