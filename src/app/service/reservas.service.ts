import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, throwError } from 'rxjs';
import { StateService } from './state.service';
import { environment } from 'src/environments/environment';
import { Reserva, ReservaAPI, ReservaPost } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private stateService: StateService) {}

  getReservas(pageNumber: Number): Observable<ReservaAPI | any> {
    return this.fetchReservasData(pageNumber).pipe(
      map((data: ReservaAPI) => {
        this.stateService.setReservasListState({
          reservasPaginado: data,
          reservasContent: data.content,
        });
        return data;
      }),
      catchError((error: any) => {
        console.error('Error fetching data:', error);
        return of([]);
      })
    );
  }

  private fetchReservasData(pageNumber: Number): Observable<ReservaAPI | any> {
    return this.http.get(this.apiBaseUrl + `reservas/?page=${pageNumber}&size=5&sort=id,asc`);
  }

  addReserva(reserva: ReservaPost): Observable<ReservaAPI | any> {
    return this.http.post(this.apiBaseUrl + 'reservas/', reserva).pipe(
      map((data: any) => {
        // Manejo exitoso de la reserva agregada
        const currentState = this.stateService.getReservasListState();
        const newReservasContent = [...currentState.reservasContent, data];
        this.stateService.setReservasListState({
          reservasContent: newReservasContent,
          reservasPaginado: {
            ...currentState.reservasPaginado,
            content: newReservasContent,
          },
        });
      }),
      catchError((error) => {
        return throwError(() => error); // Devuelve el error completo incluyendo el cuerpo (body) del error.
      })
    );
  }

  removeReserva(index: number): void {
    this.http.delete(this.apiBaseUrl + 'reservas/' + index).subscribe(() => {
      const currentState = this.stateService.getReservasListState();
      const newReservasContent = currentState.reservasContent.filter(
        (reserva: Reserva) => reserva.id !== index
      );
      this.stateService.setReservasListState({
        reservasContent: newReservasContent,
        reservasPaginado: {
          ...currentState.reservasPaginado,
          content: newReservasContent,
        },
      });

    });
  }

  updateReserva(reserva: ReservaPost, idReserva: Number):  Observable<ReservaAPI | any> {
    return this.http.put(this.apiBaseUrl + 'reservas/' + idReserva, reserva).pipe(
      map((reservaResponse: any) => {
      const currentState = this.stateService.getReservasListState();
      const newReservasContent = currentState.reservasContent.map((reserva: any) => {
        if (reserva.id === idReserva) {
          return reservaResponse;
        }
        return reserva;
      });
      this.stateService.setReservasListState({
        reservasContent: newReservasContent,
        reservasPaginado: {
          ...currentState.reservasPaginado,
          content: newReservasContent,
        },
      });
    }),
    catchError((error) => {
      return throwError(() => error);
    }));
  }
}
