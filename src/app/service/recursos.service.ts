import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {

  private apiBaseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  getRecursos(): any {
    return this.http.get(this.apiBaseUrl + 'recursos/');
  }
}
