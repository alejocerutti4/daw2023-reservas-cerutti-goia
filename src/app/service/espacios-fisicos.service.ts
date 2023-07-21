import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { StateService } from './state.service';
import { environment } from '../../environments/environment';

export interface EspacioFisico {
  id?: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  recursos: any[]
  estado: any;
}

@Injectable({
  providedIn: 'root'
})
export class EspaciosFisicosService {
  private apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private stateService: StateService) {}

  getEspaciosFisicos(): Observable<any> {
    return this.http.get<any>(this.apiBaseUrl+"espaciosFisicos/all").pipe(
      map((data: any) => {
        this.stateService.setEspaciosFisicosListState({
          espaciosFisicos: data,
        });
        return data;
      })
    );
  }

  deleteEspacioFisico(index: number): void {
    this.http.delete<any>(this.apiBaseUrl+"espaciosFisicos/"+index).subscribe(() => {
      const currentState = this.stateService.getEspaciosFisicosListState();
      const newEspaciosFisicosContent = currentState.espaciosFisicos.filter(
        (espacioFisico: any) => espacioFisico.id !== index
      );
      this.stateService.setEspaciosFisicosListState({
        espaciosFisicos: newEspaciosFisicosContent,
      });
    })
  }

  addEspacioFisico(espacioFisico: EspacioFisico): void {
    this.http.post<any>(this.apiBaseUrl+"espaciosFisicos/", espacioFisico).subscribe((espacioFisico: any) => {
      const currentState = this.stateService.getEspaciosFisicosListState();
      const newEspaciosFisicosContent = [...currentState.espaciosFisicos, espacioFisico];
      this.stateService.setEspaciosFisicosListState({
        espaciosFisicos: newEspaciosFisicosContent,
      });
    });
  }

  updateEspacioFisico(espacioFisico: EspacioFisico, idEspacioFisico: Number): void {
    this.http.put<any>(this.apiBaseUrl+"espaciosFisicos/"+idEspacioFisico, espacioFisico).subscribe((espacioFisicoResponse: any) => {
      const currentState = this.stateService.getEspaciosFisicosListState();
      const newEspaciosFisicosContent = currentState.espaciosFisicos.map((espacioFisico: any) => {
        if (espacioFisico.id === idEspacioFisico) {
          return espacioFisicoResponse;
        }
        return espacioFisico;
      });
      this.stateService.setEspaciosFisicosListState({
        espaciosFisicos: newEspaciosFisicosContent,
      });
    });
  }
}
