import { Tarea } from '../Tarea.model';

export interface ListadoTareaResponse {
  meta: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
  links: {
    nextPage: string | null;
    previousPage: string | null;
  };
  data: Tarea[];
}
