import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReservasService } from '../service/reservas.service';
import { Subscription } from 'rxjs';
import { StateService } from '../service/state.service';

@Component({
  selector: 'app-reservas-list',
  templateUrl: './reservas-list.component.html',
  styleUrls: ['./reservas-list.component.css']
})
export class ReservaListComponent implements OnInit, OnDestroy {
  reservasPaginado: any;
  reservasContent: any[] = [];
  shouldOpenModalReserva: boolean = false;
  private reservasListSuscriber : Subscription = new Subscription();


  constructor(private reservasService: ReservasService, private stateService: StateService) { }

  ngOnInit() {
    this.getReservaData();

    this.stateService.setTitle('Listado de reservas');
    this.stateService.setButtonContent('Nueva Reserva');
    this.stateService.setShouldOpenModalReserva(false);

    this.reservasListSuscriber = this.reservasService.getReservasChanged().subscribe((reservas: any) => {
      this.reservasPaginado = reservas;
      this.reservasContent = reservas.content;
    });

    this.stateService.shouldOpenModalReserva$.subscribe((shouldOpen: boolean) => {
      this.shouldOpenModalReserva = shouldOpen;
      if (shouldOpen) {
        //logic to open the modal
      }
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
      this.reservasContent = reservas.content;
    });
  }
}
