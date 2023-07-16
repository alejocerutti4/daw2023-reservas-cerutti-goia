import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  private apiBaseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  getEstados(): any {
    return this.http.get(this.apiBaseUrl + 'estados/');
  }


}
