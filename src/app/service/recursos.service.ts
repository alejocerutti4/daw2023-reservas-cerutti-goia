import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {

  private apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRecursos(): any {
    return this.http.get(this.apiBaseUrl + 'recursos/');
  }
}
