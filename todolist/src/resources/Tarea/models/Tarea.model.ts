import { TareaEstado } from "../../TareaEstado/models/TareaEstado.model";

export interface Tarea {
  id: number;
  nombre: string;
  fechaLimite: string;
  fechaCreacion: string;
  descripcion?: string;
  estado: TareaEstado;
}
