import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  private apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSolicitantes(): Observable<any> {
    return this.http.get<any>(this.apiBaseUrl+"solicitantes/all")
  }
}

