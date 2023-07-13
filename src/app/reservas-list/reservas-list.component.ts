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
  styleUrls: ['./reservas-list.component.css']
})
export class ReservaListComponent implements OnInit, OnDestroy {
  espaciosFisicos: any[] = [];
  solicitantes: any[] = [];
  reservasPaginado: any;
  reservasContent: any[] = [];
  shouldOpenModalReserva: boolean = false;
  private reservasListSuscriber : Subscription = new Subscription();
  reservaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private reservasService: ReservasService, 
    private stateService: StateService, 
    private espaciosFisicosService: EspaciosFisicosService,
    private solicitantesService: SolicitantesService
    ) { 
    this.reservaForm = this.formBuilder.group({
      //Dos campos para la fecha y la hora de inicio por separado
      fechaInicio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      //Dos campos para la fecha y la hora de fin por separado
      fechaFin: ['', Validators.required],
      horaFin: ['', Validators.required],
      motivoReserva: [''],
      cantidadPersonas: [Number, [Validators.required, Validators.min(1)]],
      comentario: [''],
      motivoRechazo: [''],
      solicitanteId:  ['', Validators.required],
      espacioFisicoSeleccionado: ['', Validators.required],
      //falta solicitante y espacioFisico con la eleccion de sus recursos.
    });
  }

  ngOnInit() {
    this.getEspaciosFisicos();
    this.getSolicitantes();
    this.getReservaData();
    this.initializeHeader();
    this.suscribeToReservas();
    this.suscribeToState();
  }

  ngOnDestroy() {
    this.reservasListSuscriber.unsubscribe();
  }

  initializeHeader(){
    this.stateService.setHeaderState({
      title: 'Listado de reservas',
      buttonContent: 'Nueva Reserva',
      openModal: this.openModalReserva
    });
    this.stateService.setReservasListState({
      shouldOpenModalReserva: false
    });
  }

  suscribeToReservas() {
    this.reservasListSuscriber = this.stateService.getReservasListStateSubject().subscribe((reservas: any) => {
      this.reservasPaginado = reservas.reservasPaginado;
      this.reservasContent = reservas.reservasContent;
    });
  }

  suscribeToState() {
    this.stateService.getReservasListStateSubject().subscribe((state: any) => {
      this.shouldOpenModalReserva = state.shouldOpenModalReserva;
    }
  );
  }

  removeReserva(id: number) {
    this.reservasService.removeReserva(id);
  }

  onClose(){
    this.stateService.setReservasListState({
      shouldOpenModalReserva: false
    });
  }

  openModalReserva() {
    this.stateService.setReservasListState({
      shouldOpenModalReserva: true
    });
  }

  private getReservaData() {
    this.reservasService.getReservas().subscribe((reservas: any) => {
      this.reservasPaginado = reservas;
      this.reservasContent = reservas.content;
    });
  }

  private getEspaciosFisicos(){
    this.espaciosFisicosService.getEspaciosFisicos().subscribe(
      (response) => {
        this.espaciosFisicos = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private getSolicitantes(){
    this.solicitantesService.getSolicitantes().subscribe(
      (response) => {
        this.solicitantes = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addReserva(){
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
      const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
      const dia = String(fechaActual.getDate()).padStart(2, "0");
      const hora = String(fechaActual.getHours()).padStart(2, "0");
      const minutos = String(fechaActual.getMinutes()).padStart(2, "0");
      const segundos = String(fechaActual.getSeconds()).padStart(2, "0");
      
      const fechaHoraCreacion = `${anio}-${mes}-${dia}T${hora}:${minutos}:${segundos}`;

      // Creacion la nueva reserva
      const nuevaReserva = {
        fechaHoraCreacionReserva: fechaHoraCreacion,
        fechaHoraInicioReserva: fechaHoraInicio,
        fechaHoraFinReserva: fechaHoraFin,
        motivoReserva: this.reservaForm.value.motivoReserva,
        cantidadPersonas: this.reservaForm.value.cantidadPersonas,
        comentario: this.reservaForm.value.comentario,
        motivoRechazo: this.reservaForm.value.motivoRechazo,
        solicitante: {id: 2},
        espacioFisico: {id: 1},
        estado: {id: 1}
      };

      console.log("Aca")
  
      // Aquí puedes llamar a tu servicio o realizar cualquier otra lógica para registrar la reserva
      this.reservasService.addReserva(nuevaReserva)
      this.onClose();
    }
  }
}
