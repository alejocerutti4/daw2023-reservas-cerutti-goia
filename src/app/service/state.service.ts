import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private buttonContentSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private shouldOpenModalReservaSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  public title$ = this.titleSubject.asObservable();
  public buttonContent$ = this.buttonContentSubject.asObservable();
  public shouldOpenModalReserva$ = this.shouldOpenModalReservaSubject.asObservable();

  setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  setButtonContent(content: string): void {
    this.buttonContentSubject.next(content);
  }

  setShouldOpenModalReserva(shouldOpen: boolean): void {
    this.shouldOpenModalReservaSubject.next(shouldOpen);
  }
}
