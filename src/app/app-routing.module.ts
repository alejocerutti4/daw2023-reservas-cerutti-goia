import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservaListComponent } from './reservas-list/reservas-list.component';

const routes: Routes = [
  { path: 'reservas', component: ReservaListComponent },
  { path: '**', redirectTo: 'reservas' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
