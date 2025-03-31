export interface ListadoTareaRequest {
  tareaId?: number;
  tareaEstadoId?: number;
  page?: number;
  pageSize?: number;
  nombre?: string;
  orderBy?: string[];
}
