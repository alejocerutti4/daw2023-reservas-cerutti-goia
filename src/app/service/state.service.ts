import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface HeaderState {
  title: string;
  buttonContent: string;
  openModal: Function;
}

interface ReservasListState {
  reservasPaginado: any;
  reservasContent: any[];
  shouldOpenModalReserva: boolean;
}

interface EspaciosFisicosListState {
  espaciosFisicos: any[];
  shouldOpenModalEspacioFisico: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private headerStateSubject: BehaviorSubject<HeaderState> = new BehaviorSubject<HeaderState>({
    title: '',
    buttonContent: '',
    openModal: () => {}
  });

  private reservasListStateSubject: BehaviorSubject<ReservasListState> = new BehaviorSubject<ReservasListState>({
    reservasPaginado: null,
    reservasContent: [],
    shouldOpenModalReserva: false
  });

  private espaciosFisicosListStateSubject: BehaviorSubject<EspaciosFisicosListState> = new BehaviorSubject<EspaciosFisicosListState>({
    espaciosFisicos: [],
    shouldOpenModalEspacioFisico: false
  });

  setHeaderState(newState: Partial<HeaderState>): void {
    const currentState = this.headerStateSubject.getValue();
    const updatedState = { ...currentState, ...newState };
    this.headerStateSubject.next(updatedState);
  }

  setReservasListState(newState: Partial<ReservasListState>): void {
    const currentState = this.reservasListStateSubject.getValue();
    const updatedState = { ...currentState, ...newState };
    this.reservasListStateSubject.next(updatedState);
  }

  getHeaderStateSubject(): Observable<HeaderState> {
    return this.headerStateSubject.asObservable();
  }

  getReservasListStateSubject(): Observable<ReservasListState> {
    return this.reservasListStateSubject.asObservable();
  }

  getHeaderState(): HeaderState {
    return this.headerStateSubject.getValue();
  }

  getReservasListState(): ReservasListState {
    return this.reservasListStateSubject.getValue();
  }

  setEspaciosFisicosListState(newState: Partial<EspaciosFisicosListState>): void {
    const currentState = this.espaciosFisicosListStateSubject.getValue();
    const updatedState = { ...currentState, ...newState };
    this.espaciosFisicosListStateSubject.next(updatedState);
  }

  getEspaciosFisicosListStateSubject(): Observable<EspaciosFisicosListState> {
    return this.espaciosFisicosListStateSubject.asObservable();
  }

  getEspaciosFisicosListState(): EspaciosFisicosListState {
    return this.espaciosFisicosListStateSubject.getValue();
  }

}
