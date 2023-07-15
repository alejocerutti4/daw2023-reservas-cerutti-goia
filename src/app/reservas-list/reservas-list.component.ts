import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReservasService } from '../service/reservas.service';
import { Subscription } from 'rxjs';
import { StateService } from '../service/state.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspaciosFisicosService } from '../service/espacios-fisicos.service';
import { SolicitantesService } from '../service/solicitantes.service';

@Component({
  selector: 'app-reservas-list',
  templateUrl: './reservas-list.component.html',
  styleUrls: ['./reservas-list.component.css'],
})
export class ReservaListComponent implements OnInit, OnDestroy {
  espaciosFisicos: any[] = [];
  solicitantes: any[] = [];
  recursosEspacioFisico: any[] = [];
  recursosSeleccionados: any[] = [];
  maxPersonas: number = 0;
  reservasPaginado: any;
  reservasContent: any[] = [];
  shouldOpenModalReserva: boolean = false;
  reservaForm: FormGroup;
  isEditing: boolean = false;
  private reservasListSuscriber: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private reservasService: ReservasService,
    private stateService: StateService,
    private espaciosFisicosService: EspaciosFisicosService,
    private solicitantesService: SolicitantesService
  ) {
    this.reservaForm = this.formBuilder.group({
      //Dos campos para la fecha y la hora de inicio por separado
      id: [Number],
      fechaInicio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      //Dos campos para la fecha y la hora de fin por separado
      fechaFin: ['', Validators.required],
      horaFin: ['', Validators.required],
      motivoReserva: [''],
      cantidadPersonas: [Number, [Validators.required, Validators.min(1)]],
      comentario: [''],
      motivoRechazo: [''],
      solicitanteId: [Number, Validators.required],
      espacioFisicoSeleccionado: [Number, Validators.required],
      recursosSeleccionados: [[]],
    });
  }

  ngOnInit() {
    this.getEspaciosFisicos();
    this.getSolicitantes();
    this.getReservaData();
    this.initializeHeader();
    this.suscribeToReservas();
    this.suscribeToState();
    this.suscribeToEspacioFisico();
  }

  ngOnDestroy() {
    this.reservasListSuscriber.unsubscribe();
  }

  initializeHeader() {
    this.stateService.setHeaderState({
      title: 'Listado de reservas',
      buttonContent: 'Nueva Reserva',
      openModal: this.openModalReserva,
    });
    this.stateService.setReservasListState({
      shouldOpenModalReserva: false,
    });
  }

  suscribeToReservas() {
    this.reservasListSuscriber = this.stateService
      .getReservasListStateSubject()
      .subscribe((reservas: any) => {
        this.reservasPaginado = reservas.reservasPaginado;
        this.reservasContent = reservas.reservasContent;
      });
  }

  suscribeToState() {
    this.stateService.getReservasListStateSubject().subscribe((state: any) => {
      if(this.shouldOpenModalReserva != state.shouldOpenModalReserva) {
        this.shouldOpenModalReserva = state.shouldOpenModalReserva;
        if (this.shouldOpenModalReserva) {
          this.isEditing = false;
          this.openModalReserva(null);
        }
      }
    });
  }

  removeReserva(id: number) {
    this.reservasService.removeReserva(id);
  }

  onClose() {
    this.stateService.setReservasListState({
      shouldOpenModalReserva: false,
    });
  }

  openModalReserva(reserva: any) {
    this.stateService.setReservasListState({
      shouldOpenModalReserva: true,
    });

    if (reserva) {
      this.reservaForm.patchValue({
        id: reserva.id,
        fechaInicio: reserva.fechaHoraInicioReserva.split('T')[0],
        horaInicio: reserva.fechaHoraInicioReserva
          .split('T')[1]
          .substring(0, 5),
        fechaFin: reserva.fechaHoraFinReserva.split('T')[0],
        horaFin: reserva.fechaHoraFinReserva.split('T')[1].substring(0, 5),
        motivoReserva: reserva.motivoReserva,
        cantidadPersonas: reserva.cantidadPersonas,
        comentario: reserva.comentario,
        motivoRechazo: reserva.motivoRechazo,
        solicitanteId: reserva.solicitante.id,
        espacioFisicoSeleccionado: reserva.espacioFisico.id,
        recursosSeleccionados: reserva.recursosSolicitados,
      });
      this.isEditing = true;
      this.actualizarDatos(reserva.espacioFisico.id);
    } else {
      this.reservaForm.reset();
    }
  }

  private getReservaData() {
    this.reservasService.getReservas().subscribe((reservas: any) => {
      this.reservasPaginado = reservas;
      this.reservasContent = reservas.content;
      console.log(reservas.content);
    });
  }

  private getEspaciosFisicos() {
    this.espaciosFisicosService.getEspaciosFisicos().subscribe(
      (response) => {
        this.espaciosFisicos = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private getSolicitantes() {
    this.solicitantesService.getSolicitantes().subscribe(
      (response) => {
        this.solicitantes = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private suscribeToEspacioFisico() {
    const espacioFisicoControl = this.reservaForm.get(
      'espacioFisicoSeleccionado'
    );
    if (espacioFisicoControl) {
      espacioFisicoControl.valueChanges.subscribe((espacioFisicoId) => {
        // actualizacion de los recursos
        this.actualizarDatos(espacioFisicoId);
        this.cleanSelectedResources();
      });
    }
  }

  // Método para actualizar datos según el espacio físico seleccionado
  actualizarDatos(espacioFisicoId: any) {
    const espacioFisicoSeleccionado = this.espaciosFisicos.find(
      (espacioFisico) => espacioFisico.id == espacioFisicoId
    );
    if (espacioFisicoSeleccionado && !this.isEditing) {
      this.recursosEspacioFisico = espacioFisicoSeleccionado.recursos.map(
        (recurso: any) => {
          return {
            ...recurso,
            seleccionado: false,
          };
        }
      );

      this.maxPersonas = espacioFisicoSeleccionado.capacidad;
    } else if (espacioFisicoSeleccionado && this.isEditing ) {
      // now we have recursosSeleccionados from reserva, so we need to check them
      this.recursosEspacioFisico = espacioFisicoSeleccionado.recursos.map(
        (recurso: any) => {
          const recursoSeleccionado = this.reservaForm.value.recursosSeleccionados.find(
            (r: any) => r.id == recurso.id
          );
          if (recursoSeleccionado) {
            return {
              ...recurso,
              seleccionado: true,
            };
          }
          return {
            ...recurso,
            seleccionado: false,
          };
        }
      );
    } else {
      this.recursosEspacioFisico = [];
      this.maxPersonas = 0;
    }
  }

  onRecursoSeleccionado(recurso: any) {
    recurso.seleccionado = !recurso.seleccionado; // Invertir el estado del recurso seleccionado

    const recursosSeleccionadosControl = this.reservaForm.get(
      'recursosSeleccionados'
    );
    const recursosSeleccionados = recursosSeleccionadosControl?.value as any[]; // Obtener el valor actual del array

    if (recurso.seleccionado) {
      recursosSeleccionados.push(recurso); // Agregar el nuevo recurso al array
    } else {
      // Eliminar el recurso del arreglo de recursos seleccionados
      const nuevosRecursosSeleccionados = recursosSeleccionados.filter(
        (r) => r !== recurso
      );
      recursosSeleccionadosControl?.setValue(nuevosRecursosSeleccionados);
    }
  }

  cleanSelectedResources() {
    const recursosSeleccionadosControl = this.reservaForm.get(
      'recursosSeleccionados'
    );
    recursosSeleccionadosControl?.setValue([]);
  }

  addReserva() {
    if (this.reservaForm.valid) {
      // Se arma el localDateTime de la fechaHoraInicioReserva y fechaHoraFinReserva

      const fechaInicio = this.reservaForm.value.fechaInicio;
      const horaInicio = this.reservaForm.value.horaInicio;
      const fechaFin = this.reservaForm.value.fechaFin;
      const horaFin = this.reservaForm.value.horaFin;

      const fechaHoraInicio = `${fechaInicio}T${horaInicio}:00`;
      const fechaHoraFin = `${fechaFin}T${horaFin}:00`;

      // Se arma la fechaHoraCreacionReserva, que es la actual
      const fechaActual = new Date();
      const anio = fechaActual.getFullYear();
      const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaActual.getDate()).padStart(2, '0');
      const hora = String(fechaActual.getHours()).padStart(2, '0');
      const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
      const segundos = String(fechaActual.getSeconds()).padStart(2, '0');

      const fechaHoraCreacion = `${anio}-${mes}-${dia}T${hora}:${minutos}:${segundos}`;
      // Creacion la nueva reserva
      const nuevaReserva = {

        fechaHoraCreacionReserva: fechaHoraCreacion,
        fechaHoraInicioReserva: fechaHoraInicio,
        fechaHoraFinReserva: fechaHoraFin,
        comentario: this.reservaForm.value.comentario,
        motivoReserva: this.reservaForm.value.motivoReserva,
        motivoRechazo: this.reservaForm.value.motivoRechazo,
        cantidadPersonas: this.reservaForm.value.cantidadPersonas,
        solicitante: { id: this.reservaForm.value.solicitanteId },
        espacioFisico: { id: this.reservaForm.value.espacioFisicoSeleccionado },
        recursosSolicitados: this.reservaForm.value.recursosSeleccionados,
        estado: { id: 1 },
      };

      // Aquí puedes llamar a tu servicio o realizar cualquier otra lógica para registrar la reserva
      if(!this.isEditing) {
        this.reservasService.addReserva(nuevaReserva);
      } else {
        this.reservasService.updateReserva(nuevaReserva, this.reservaForm.value.id);
      }

      this.onClose();
      this.reservaForm.reset();
    }
  }
}
