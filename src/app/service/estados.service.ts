import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  private apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEstados(): any {
    return this.http.get(this.apiBaseUrl + 'estados/');
  }


}
