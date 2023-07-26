import { Component, OnInit } from '@angular/core';
import { StateService } from '../service/state.service';
import { EspaciosFisicosService } from '../service/espacios-fisicos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecursosService } from '../service/recursos.service';
import { EstadosService } from '../service/estados.service';
import { EspacioFisico, EspacioFisicoPost, Estado, Recurso } from '../types';

export interface RecursoForm {
  id: string;
  seleccionado: boolean;
  nombre: string;
}

export interface EstadoForm {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-espacios-fisicos-list',
  templateUrl: './espacios-fisicos-list.component.html',
  styleUrls: ['./espacios-fisicos-list.component.css'],
})
export class EspaciosFisicosListComponent implements OnInit {
  espaciosFisicos: EspacioFisico[] = [];
  recursos: RecursoForm[] = [];
  estados: EstadoForm[] = [];
  isEditing: boolean = false;
  shouldOpenModalEspacioFisico: boolean = false;
  espacioFisicoForm: FormGroup;

  constructor(
    private stateService: StateService,
    private espaciosFisicosService: EspaciosFisicosService,
    private recursosService: RecursosService,
    private estadosService: EstadosService,
    private formBuilder: FormBuilder
  ) {
    this.espacioFisicoForm = this.formBuilder.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: [''],
      capacidad: [null, [Validators.required, Validators.min(1)]],
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
      openModal: () => this.openModalEspacioFisico(),
    });
  }

  getDependencies(): void {
    this.getRecursos();
    this.getEstados();
  }

  // Assuming the required imports and class definitions are already present

  getRecursos(): void {
    this.recursosService.getRecursos().subscribe(
      (response) => {
        this.recursos = response;
      },
      (error) => {
        // Handle the error appropriately, e.g., show an error message or log the error.
        console.error('Error fetching resources:', error);
      }
    );
  }

  getEstados(): void {
    this.estadosService.getEstados().subscribe((data: any) => {
      this.estados = data.content.filter(
        (estado: Estado) => estado.ambito.id === 2
      );
    });
  }

  subscribeToModalState(): void {
    this.stateService
      .getEspaciosFisicosListStateSubject()
      .subscribe((state) => {
        this.shouldOpenModalEspacioFisico = state.shouldOpenModalEspacioFisico;
      });
  }

  openModalEspacioFisico(espacio?: EspacioFisico) {
    this.stateService.setEspaciosFisicosListState({
      shouldOpenModalEspacioFisico: true,
    });

    if (espacio) {
      this.isEditing = true;
      this.espacioFisicoForm.get('id')?.setValue(espacio.id);
      this.espacioFisicoForm.get('nombre')?.setValue(espacio.nombre);
      this.espacioFisicoForm.get('descripcion')?.setValue(espacio.descripcion);
      this.espacioFisicoForm.get('capacidad')?.setValue(espacio.capacidad);
      this.espacioFisicoForm.get('recursos')?.setValue(espacio.recursos.map((recurso: any) => ({ ...recurso, seleccionado: true })));
      this.espacioFisicoForm.get('estadoId')?.setValue(espacio.estado.id);
    } else {
      if (this.espacioFisicoForm) {
        this.espacioFisicoForm.reset();
        this.isEditing = false;
        this.getDependencies()
      }
    }
  }

  getEspaciosFisicos(): void {
    this.espaciosFisicosService.getEspaciosFisicos().subscribe((data: any) => {
      const espaciosFisicosFiltered = data.filter(
        (espacioFisico: EspacioFisico) => espacioFisico.nombre !== ''
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
    if (this.espacioFisicoForm.valid) {
      console.log(this.espacioFisicoForm.get('recursos')?.value);
      const espacioFisico: EspacioFisicoPost = {
        nombre: this.espacioFisicoForm.get('nombre')?.value,
        descripcion: this.espacioFisicoForm.get('descripcion')?.value,
        capacidad: this.espacioFisicoForm.get('capacidad')?.value,
        recursos: this.espacioFisicoForm
          .get('recursos')
          ?.value?.filter(
            (recurso: RecursoForm) => recurso.seleccionado !== false
          ),
        estado: {
          id: this.espacioFisicoForm.get('estadoId')?.value,
        },
      };
      if (!this.isEditing) {
        this.espaciosFisicosService.addEspacioFisico(espacioFisico);
      } else {
        const id = this.espacioFisicoForm.get('id')?.value;
        this.espaciosFisicosService.updateEspacioFisico(espacioFisico, id);
      }
      this.espacioFisicoForm.get('recursos')?.setValue([]);
      this.espacioFisicoForm.reset();
      this.onCloseModalEspacioFisico();
    } else {
      alert('Faltan datos');
    }
  };

  onCloseModalEspacioFisico(): void {
    this.stateService.setEspaciosFisicosListState({
      shouldOpenModalEspacioFisico: false,
    });
    this.espacioFisicoForm.reset();
  }

  subscribeToEspaciosFisicosListState(): void {
    this.stateService.getEspaciosFisicosListStateSubject().subscribe((data) => {
      const espaciosFisicosFiltered = data.espaciosFisicos.filter(
        (espacioFisico: EspacioFisico) => espacioFisico.nombre !== ''
      );
      this.espaciosFisicos = espaciosFisicosFiltered;
    });
  }

  getRecursosForTooltip(recursos: Recurso[] | undefined) {
    if (recursos === undefined) {
      return '';
    } else {
      let recursosList = '<span>Recursos Disponibles: </span>';

      recursos.forEach((recurso: Recurso) => {
        recursosList += `<span>• ${recurso.nombre}</span>`;
      });

      recursosList += '';

      return recursosList;
    }
  }

  selectEstado(estadoId: string) {
    this.espacioFisicoForm.get('estadoId')?.setValue(estadoId);
  }

  selectRecurso(recursoId: string) {
    const recursosControl = this.espacioFisicoForm.get('recursos')!;
    const recursos = (recursosControl.value as RecursoForm[]) || [];

    const recurso = this.recursos.find((r) => r.id === recursoId);

    if (recurso) {
      if (recurso.seleccionado !== undefined) {
        recurso.seleccionado = !recurso.seleccionado;
      } else {
        recurso.seleccionado = true;
      }

      if (recurso.seleccionado) {
        // Add the resource to the recursos array if it's not already present
        if (!recursos.some((r) => r.id === recursoId)) {
          recursos.push({ ...recurso });
        }
      } else {
        // Deselect: Remove the resource from the recursos array
        recursosControl.setValue(recursos.filter((r) => r.id !== recursoId));
        return;
      }

      recursosControl.setValue(recursos);
    }
  }

  isRecursoSelected(recursoId: string) {
    const recursos = this.espacioFisicoForm.get('recursos')
      ?.value as RecursoForm[];
    if (recursos) {
      const seleccionado =  recursos.find((r) => r.id === recursoId)?.seleccionado
      return (seleccionado !== undefined && seleccionado !== null) ? seleccionado : false;
    } else {
      return false;
    }
  }

  isEstadoSelected(estadoId: string) {
    const estado = this.espacioFisicoForm.get('estadoId')?.value;
    return estado === estadoId;
  }
}
