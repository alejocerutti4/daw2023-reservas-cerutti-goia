import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ReservasService } from '../service/reservas.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservas-list',
  templateUrl: './reservas-list.component.html',
  styleUrls: ['./reservas-list.component.css']
})
export class ReservaListComponent implements OnInit, OnDestroy {
  reservasPaginado: any;
  reservasContent: any[] = [];
  private reservasListSuscriber : Subscription = new Subscription();

  constructor(private reservasService: ReservasService) { }

  ngOnInit() {
    this.getReservaData();
    this.reservasListSuscriber = this.reservasService.getReservasChanged().subscribe((reservas: any) => {
      this.reservasPaginado = reservas;
      this.reservasContent = reservas.content;
    });
  }

  ngOnDestroy() {
    this.reservasListSuscriber.unsubscribe();
  }

  removeReserva(id: number) {
    this.reservasService.removeReserva(id);
  }

  private getReservaData() {
    this.reservasService.getReservas().subscribe((reservas: any) => {
      this.reservasPaginado = reservas;
      console.log(reservas)
      this.reservasContent = reservas.content;
    });
  }
}
