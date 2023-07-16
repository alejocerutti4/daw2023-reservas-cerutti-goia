import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { ReservaListComponent } from './reservas-list/reservas-list.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EspaciosFisicosListComponent } from './espacios-fisicos-list/espacios-fisicos-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ReservaListComponent,
    SidebarComponent,
    EspaciosFisicosListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
