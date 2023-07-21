import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, throwError } from 'rxjs';
import { StateService } from './state.service';
import { environment } from 'src/environments/environment';

interface ReservaData {
  fechaHoraCreacionReserva: string;
  fechaHoraInicioReserva: string;
  fechaHoraFinReserva: string;
  comentario: string;
  motivoReserva: string;
  motivoRechazo: string;
  cantidadPersonas: number;
  solicitante: {
    id: number;
  };
  espacioFisico: {
    id: number;
    recursos?: {
      id: number;
    }[];
  };
  recursosSolicitados?: [
    {
      id: number
    }
  ];
  estado?: {
    id: number;
  };
}


@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private stateService: StateService) {}

  getReservas(pageNumber: Number): Observable<any[]> {
    return this.fetchReservasData(pageNumber).pipe(
      map((data: any) => {
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

  private fetchReservasData(pageNumber: Number): Observable<any> {
    return this.http.get(this.apiBaseUrl + `reservas/?page=${pageNumber}&size=5`);
  }

  addReserva(reserva: ReservaData): Observable<any> {
    return this.http.post(this.apiBaseUrl + 'reservas/', reserva).pipe(
      map((reserva: any) => {
        // Manejo exitoso de la reserva agregada
        const currentState = this.stateService.getReservasListState();
        const newReservasContent = [...currentState.reservasContent, reserva];
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
        (reserva: any) => reserva.id !== index
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

  updateReserva(reserva: ReservaData, idReserva: Number):  Observable<any> {
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
      return throwError(() => error); // Devuelve el error completo incluyendo el cuerpo (body) del error.
    }));
  }
}
