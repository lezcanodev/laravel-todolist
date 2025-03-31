import { CrearTareaRequest } from '../CrearTarea/crearTarea.request';

export interface ActualizarTareaRequest extends CrearTareaRequest {
  id: number
}
