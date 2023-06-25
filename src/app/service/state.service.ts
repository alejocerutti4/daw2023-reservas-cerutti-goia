import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private buttonContentSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private shouldOpenModalReservaSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private openModalSubject: BehaviorSubject<Function> = new BehaviorSubject<Function>(() => {});


  setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  setButtonContent(content: string): void {
    this.buttonContentSubject.next(content);
  }

  setShouldOpenModalReserva(shouldOpen: boolean): void {
    this.shouldOpenModalReservaSubject.next(shouldOpen);
  }

  setOpenModal(openModal: Function): void {
    this.openModalSubject.next(openModal);
  }

  getTitle(): Observable<string> {
    return this.titleSubject.asObservable();
  }

  getButtonContent(): Observable<string> {
    return this.buttonContentSubject.asObservable();
  }

  getShouldOpenModalReserva(): Observable<boolean> {
    return this.shouldOpenModalReservaSubject.asObservable();
  }

  getOpenModal(): Observable<Function> {
    return this.openModalSubject.asObservable();
  }

}
