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
    this.initializeHeader();
    this.suscribeToReservas();
    this.suscribeToState();
  }

  ngOnDestroy() {
    this.reservasListSuscriber.unsubscribe();
  }

  initializeHeader(){
    this.stateService.setHeaderState({
      title: 'Listado de reservas',
      buttonContent: 'Nueva Reserva',
      openModal: this.openModalReserva
    });
    this.stateService.setReservasListState({
      shouldOpenModalReserva: false
    });
  }

  suscribeToReservas() {
    this.reservasListSuscriber = this.stateService.getReservasListStateSubject().subscribe((reservas: any) => {
      this.reservasPaginado = reservas.reservasPaginado;
      this.reservasContent = reservas.reservasContent;
    });
  }

  suscribeToState() {
    this.stateService.getReservasListStateSubject().subscribe((state: any) => {
      this.shouldOpenModalReserva = state.shouldOpenModalReserva;
    }
  );
  }

  removeReserva(id: number) {
    this.reservasService.removeReserva(id);
  }

  onClose(){
    this.stateService.setReservasListState({
      shouldOpenModalReserva: false
    });
  }

  openModalReserva() {
    this.stateService.setReservasListState({
      shouldOpenModalReserva: true
    });
  }

  private getReservaData() {
    this.reservasService.getReservas().subscribe((reservas: any) => {
      this.reservasPaginado = reservas;
      this.reservasContent = reservas.content;
    });
  }

}
