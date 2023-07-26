export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
}

export interface Solicitante {
  id: number;
  nombre: string;
  apellido: string;
  nroTelefono: string;
  email: string;
  legajo: number;
  rol: Rol;
}

export interface EspacioFisico {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  recursos: Recurso[];
  estado: Estado;
}

export interface EspacioFisicoPost {
  nombre: string;
  descripcion: string;
  capacidad: string;
  recursos: Recurso[];
  estado: {
    id: string;
  };
}

export interface Recurso {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Ambito {
  id: number;
  nombre: string;
}

export interface Estado {
  id: number;
  nombre: string;
  color: string;
  ambito: Ambito;
}

export interface Reserva {
  id: number;
  fechaHoraCreacionReserva: string;
  fechaHoraInicioReserva: string;
  fechaHoraFinReserva: string;
  comentario: string;
  motivoReserva: string;
  motivoRechazo: string;
  cantidadPersonas: number;
  solicitante: Solicitante;
  espacioFisico: EspacioFisico;
  recursosSolicitados: Recurso[];
  estado: Estado;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}
export interface ReservaAPI {
  content: Reserva[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ReservaPost {
  fechaHoraCreacionReserva: string;
  fechaHoraInicioReserva: string;
  fechaHoraFinReserva: string;
  comentario: string;
  motivoReserva: string;
  motivoRechazo: string;
  cantidadPersonas: number;
  solicitante: {
    id: number;
  };
  espacioFisico: {
    id: number;
    recursos?: {
      id: number;
    }[];
  };
  recursosSolicitados?: [
    {
      id: number;
    }
  ];
  estado?: {
    id: number;
  };
}
