import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EspacioFisico {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  recursos: any[]
  estado: any;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitantesService {
  private apiBaseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  getSolicitantes(): Observable<any> {
    return this.http.get<any>(this.apiBaseUrl+"solicitantes/all")
  }
}

