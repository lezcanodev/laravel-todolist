import { useCallback } from "react";
import { useServices, UseServicesOpts } from "../../Common/hooks/useServices";
import { TareaEstadoServices } from "../services/TareaEstado.services";
import { ListadoTareaEstadoResponse } from "../models/TareaEstado.model";

const tareaEstadoServices = new TareaEstadoServices();

export const useListadoTareaEstados = (
  methods?: Partial<UseServicesOpts<ListadoTareaEstadoResponse, void>>
) => {
  const getListadoTareas = useCallback(() => {
    return tareaEstadoServices.getListado();
  }, []);

  return useServices<ListadoTareaEstadoResponse, void>({
    method: getListadoTareas,
    initialFetching: true,
    simpleCache: true,
    cacheKey: "tarea-estados",
    ...methods,
  });
};
