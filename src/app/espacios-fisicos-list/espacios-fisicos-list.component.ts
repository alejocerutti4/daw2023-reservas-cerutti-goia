import { Component, OnInit } from '@angular/core';
import { StateService } from '../service/state.service';
import { EspacioFisico, EspaciosFisicosService } from '../service/espacios-fisicos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecursosService } from '../service/recursos.service';
import { EstadosService } from '../service/estados.service';

@Component({
  selector: 'app-espacios-fisicos-list',
  templateUrl: './espacios-fisicos-list.component.html',
  styleUrls: ['./espacios-fisicos-list.component.css'],
})
export class EspaciosFisicosListComponent implements OnInit {
  espaciosFisicos: EspacioFisico[] = [];
  recursos: any[] = [];
  estados: any[] = [];
  isEditing: boolean = false;
  shouldOpenModalEspacioFisico: boolean = false;
  recursoForm: FormGroup;

  constructor(
    private stateService: StateService,
    private espaciosFisicosService: EspaciosFisicosService,
    private recursosService: RecursosService,
    private estadosService: EstadosService,
    private formBuilder: FormBuilder,
  ) {
    this.recursoForm = this.formBuilder.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: [''],
      capacidad:  [null, [Validators.required, Validators.min(1)]],
      recursos: [[]],
      estadoId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.initializeHeader();
    this.getEspaciosFisicos();
    this.getDependencies();
    this.subscribeToModalState();
    this.subscribeToEspaciosFisicosListState();
  }

  initializeHeader(): void {
    this.stateService.setHeaderState({
      title: 'Espacios Fisicos',
      buttonContent: 'Nuevo Espacio Fisico',
      openModal: this.openModalEspacioFisico,
    });
  }

  getDependencies(): void {
    this.getRecursos();
    this.getEstados();
  }

  getRecursos(): void {
    this.recursosService.getRecursos().subscribe((data: any) => {
      this.recursos = data.content;
    });
  }

  getEstados(): void {
    this.estadosService.getEstados().subscribe((data: any) => {
      this.estados = data.content.filter((estado: any) => estado.ambito.id === 2);
    });
  }

  subscribeToModalState(): void {
    this.stateService
      .getEspaciosFisicosListStateSubject()
      .subscribe((state) => {
        this.shouldOpenModalEspacioFisico = state.shouldOpenModalEspacioFisico;
      });
  }

  openModalEspacioFisico(espacio?: any) {
    this.stateService.setEspaciosFisicosListState({
      shouldOpenModalEspacioFisico: true,
    });
    console.log(this.recursoForm);
    
    if(espacio) {
      this.isEditing = true;
      this.recursoForm.get('id')?.setValue(espacio.id);
      this.recursoForm.get('nombre')?.setValue(espacio.nombre);
      this.recursoForm.get('descripcion')?.setValue(espacio.descripcion);
      this.recursoForm.get('capacidad')?.setValue(espacio.capacidad);
      this.recursoForm.get('recursos')?.setValue(espacio.recursos);
      this.recursoForm.get('estadoId')?.setValue(espacio.estado.id);
    } else if (this.recursoForm) {
      this.recursoForm.reset();
      this.isEditing = false;
    }
  }

  getEspaciosFisicos(): void {
    this.espaciosFisicosService.getEspaciosFisicos().subscribe((data: any) => {
      const espaciosFisicosFiltered = data.filter(
        (espacioFisico: any) => espacioFisico.nombre !== ''
      );
      this.espaciosFisicos = espaciosFisicosFiltered;
    });
  }

  removeEspacioFisico(index: number | undefined): void {
    if (index === undefined) {
      return;
    }
    this.espaciosFisicosService.deleteEspacioFisico(index);
  }

  addEspacioFisico = () => {
    if (this.recursoForm.valid) {

      const espacioFisico: EspacioFisico = {
        nombre: this.recursoForm.get('nombre')?.value,
        descripcion: this.recursoForm.get('descripcion')?.value,
        capacidad: this.recursoForm.get('capacidad')?.value,
        recursos: this.recursoForm.get('recursos')?.value,
        estado: {
          id: this.recursoForm.get('estadoId')?.value
        }
      };
      if(!this.isEditing){
        this.espaciosFisicosService.addEspacioFisico(espacioFisico);
      }else{
        const id = this.recursoForm.get('id')?.value;
        this.espaciosFisicosService.updateEspacioFisico(espacioFisico, id);
      }

      this.onCloseModalEspacioFisico();
    }else{
      alert("Faltan datos");
    }
  };

  onCloseModalEspacioFisico(): void {
    this.stateService.setEspaciosFisicosListState({
      shouldOpenModalEspacioFisico: false,
    });
  }

  subscribeToEspaciosFisicosListState(): void {
    this.stateService.getEspaciosFisicosListStateSubject().subscribe((data) => {
      const espaciosFisicosFiltered = data.espaciosFisicos.filter(
        (espacioFisico: any) => espacioFisico.nombre !== ''
      );
      this.espaciosFisicos = espaciosFisicosFiltered;
    });
  }

  getRecursosForTooltip(recursos: any) {
    let recursosList = '<span>Recursos Disponibles: </span>';

    recursos.forEach((recurso: any) => {
      recursosList += `<span>• ${recurso.nombre}</span>`;
    });

    recursosList += '';

    return recursosList;
  }

  selectEstado(estadoId: string){
    this.recursoForm.get('estadoId')?.setValue(estadoId);
  }

  selectRecurso(recursoId: string){
    const recursosControl = this.recursoForm.get('recursos');
    const recursos = recursosControl?.value as any[]; // Obtener el valor actual del array
    const recurso = this.recursos.find((r) => r.id === recursoId);
    recurso.seleccionado = !recurso.seleccionado; // Invertir el estado del recurso seleccionado

    if (recurso.seleccionado) {
      recursos.push(recurso); // Agregar el nuevo recurso al array
    } else {
      // Eliminar el recurso del arreglo de recursos seleccionados
      const nuevosRecursos = recursos.filter(
        (r) => r !== recurso
      );
      recursosControl?.setValue(nuevosRecursos);
    }
  }

  isRecursoSelected(recursoId: string) {
    const recursos = this.recursoForm.get('recursos')?.value as any[];
    return recursos.some((r) => r.id === recursoId);
  }

  isEstadoSelected(estadoId: string) {
    const estado = this.recursoForm.get('estadoId')?.value;
    return estado === estadoId;
  }
}
