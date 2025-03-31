import { Tarea } from "../models/Tarea.model";

export class TareaChecker {
  private static readonly TAREA_ESTADO_COMPLETO_ID = 3;

  public static estaCompleto(tarea: Tarea): boolean {
    try {
      return TareaChecker.TAREA_ESTADO_COMPLETO_ID === tarea.estado.id;
    } catch (error) {
      console.error(
        "Ocurrió un error al comprobar si una tarea esta completa ",
        error
      );
      return false;
    }
  }
}
