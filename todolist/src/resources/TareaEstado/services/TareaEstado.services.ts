import { BaseServices } from '../../Common/services/base.services';
import { ListadoTareaEstadoResponse } from "../models/TareaEstado.model";


export class TareaEstadoServices extends BaseServices {
  constructor() {
    super({
      resource: "estados",
    });
  }

  async getListado(): Promise<ListadoTareaEstadoResponse> {
    try {
      return await this.get();
    } catch (error) {
      console.error(
        "Ocurrió un error a listado los estados de una tarea",
        error
      );
      throw error;
    }
  }
}
