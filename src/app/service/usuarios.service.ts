import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient) {}

  getDatos() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/users'; // Replace with the desired API URL

    return this.http.get(apiUrl);
  }
}
