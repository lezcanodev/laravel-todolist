import { BaseServices } from "../../Common/services/base.services";
import { ActualizarTareaRequest } from "../models/Actualizar/actualizarTarea.request";
import { ActualizarTareaResponse } from "../models/Actualizar/actualizarTarea.response";
import { CrearTareaRequest } from "../models/CrearTarea/crearTarea.request";
import { CrearTareaResponse } from "../models/CrearTarea/crearTarea.response";
import { EliminarTareaRequest } from "../models/Eliminar/eliminarTarea.request";
import { EliminarTareaResponse } from "../models/Eliminar/eliminarTarea.response";
import { ListadoTareaRequest } from "../models/ListadoTarea/listadoTarea.request";
import { ListadoTareaResponse } from "../models/ListadoTarea/listadoTarea.response";

export class TareaServices extends BaseServices {
  constructor() {
    super({
      resource: "tareas",
    });
  }

  async getListado(
    request: ListadoTareaRequest = {}
  ): Promise<ListadoTareaResponse> {
    try {
      const { tareaId, ...query } = request;
      const data = await this.get({
        url: tareaId ? `/${tareaId}` : "",
        query: query,
      });
      return data;
    } catch (error) {
      console.error("Ocurrió un error al obtener listado de tareas", error);
      throw error;
    }
  }

  async crear(request: CrearTareaRequest = {}): Promise<CrearTareaResponse> {
    try {
      const { ...tareaData } = request;
      const data = await this.post({
        data: tareaData,
      });
      return data;
    } catch (error) {
      console.error("Ocurrió un error al crear una tarea", error);
      throw error;
    }
  }

  async eliminar(
    request: EliminarTareaRequest
  ): Promise<EliminarTareaResponse> {
    try {
      const tareaId = request.tareaId;
      const data = await this.delete({
        url: `/${tareaId}`,
      });
      return data;
    } catch (error) {
      console.error("Ocurrió un error al eliminar una tarea", error);
      throw error;
    }
  }

  async actualizar(
    request: ActualizarTareaRequest
  ): Promise<ActualizarTareaResponse> {
    try {
      const { id: tareaId, ...tareaData } = request;
      const data = await this.put({
        url: `/${tareaId}`,
        data: tareaData,
      });
      return data;
    } catch (error) {
      console.error("Ocurrió un error al actualizar una tarea", error);
      throw error;
    }
  }
}
