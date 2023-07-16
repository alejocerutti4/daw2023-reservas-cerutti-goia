import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { StateService } from './state.service';

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
  private apiBaseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient, private stateService: StateService) {}

  getReservas(): Observable<any[]> {
    return this.fetchReservasData().pipe(
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

  private fetchReservasData(): Observable<any> {
    return this.http.get(this.apiBaseUrl + 'reservas/');
  }

  addReserva(reserva: ReservaData): void {
    this.http.post(this.apiBaseUrl + 'reservas/', reserva).subscribe((reserva: any) => {
      const currentState = this.stateService.getReservasListState();
      const newReservasContent = [...currentState.reservasContent, reserva];
      this.stateService.setReservasListState({
        reservasContent: newReservasContent,
        reservasPaginado: {
          ...currentState.reservasPaginado,
          content: newReservasContent,
        },
      });
    });
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

  updateReserva(reserva: ReservaData, idReserva: Number): void {
    this.http.put(this.apiBaseUrl + 'reservas/' + idReserva, reserva).subscribe((reservaResponse: any) => {
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
    });
  };

}
