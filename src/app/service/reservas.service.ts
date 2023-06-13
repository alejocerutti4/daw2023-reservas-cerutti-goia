import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private reservasData: any;
  private reservasChanged = new Subject<any[]>();
  private apiBaseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}


  getReservas(): Observable<any[]> {

      return this.fetchReservasData().pipe(
        map((data: any) => {
          this.reservasData = data;
          this.reservasChanged.next(this.reservasData);
          return this.reservasData;
        }),
        catchError((error: any) => {
          console.error('Error fetching data:', error);
          return of([]);
        })
      );
  }

  getReservasChanged(): Observable<any[]> {
    return this.reservasChanged.asObservable();
  }

  private fetchReservasData(): Observable<any> {
    return this.http.get(this.apiBaseUrl+'reservas/');
  }

  addReserva(reserva: string): void {
    this.http.post(this.apiBaseUrl+'reservas/', reserva).subscribe((reserva: any) => {
      this.reservasData.content.push(reserva);
      this.reservasChanged.next(this.reservasData);
    });
  }

  removeReserva(index: number): void {
      // we need to send the delete request to the server, after that we can remove the reserva from the reservasData.content
      this.http.delete(this.apiBaseUrl+'reservas/'+index).subscribe((reserva: any) => {
        this.reservasData.content.splice(index, 1);
        this.reservasChanged.next(this.reservasData);
      }
    );

  }


}
