import { Component, OnInit } from '@angular/core';
import { UsuariosService } from './service/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = '';
  usuarios: any[] = [];

  constructor(private usuarioService: UsuariosService) {}

  ngOnInit(): void {
    this.usuarioService.getDatos().subscribe(
      (data: any) => {
        this.usuarios = data;
        console.log(this.usuarios);
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  addName(name: string): void {
    const biggerId = Math.max(...this.usuarios.map((user) => user.id)) + 1;
    this.usuarios.push({ id: biggerId, name });
    this.name = '';
  }

  removeName(index: number): void {
    const usersCopy = [...this.usuarios];
    const usersFiltered = usersCopy.filter((user) => user.id !== index);
    this.usuarios = usersFiltered;

  }
}
