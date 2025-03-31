import { useCallback, useState } from "react";
import { useServices } from "../../Common/hooks/useServices";
import { ListadoTareaRequest } from "../models/ListadoTarea/listadoTarea.request";
import { ListadoTareaResponse } from "../models/ListadoTarea/listadoTarea.response";
import { TareaServices } from "../services/tarea.services";
import { CrearTareaRequest } from "../models/CrearTarea/crearTarea.request";
import { CrearTareaResponse } from "../models/CrearTarea/crearTarea.response";
import { EliminarTareaRequest } from "../models/Eliminar/eliminarTarea.request";
import { EliminarTareaResponse } from "../models/Eliminar/eliminarTarea.response";
import { ActualizarTareaRequest } from "../models/Actualizar/actualizarTarea.request";
import { ActualizarTareaResponse } from "../models/Actualizar/actualizarTarea.response";
import { Tarea } from "../models/Tarea.model";

const tareaServices = new TareaServices();

export const useListadoTareas = () => {
  const [currentRequest, setCurrentRequest] = useState<ListadoTareaRequest>({});

  const getListadoTareas = useCallback((request?: ListadoTareaRequest) => {
    setCurrentRequest(request || {});
    return tareaServices.getListado(request);
  }, []);

  const { fetchData, setData, data, ...baseProps } = useServices<
    ListadoTareaResponse,
    ListadoTareaRequest
  >({
    method: getListadoTareas,
  });

  const refresh = useCallback(() => {
    fetchData(currentRequest);
  }, [currentRequest, fetchData]);

  const actualizarListaTareas = useCallback(
    (tareaActualizada: Tarea) => {
      if (!data) return;

      // verificamos si cumple con el filtro estado
      if(currentRequest?.tareaEstadoId && currentRequest?.tareaEstadoId !== tareaActualizada?.estado?.id){
        // si no coincide con el filtro omitimos la tarea
        setData({
          ...data,
          data: data?.data?.filter((x) => x?.id !== tareaActualizada?.id),
        });

        return;
      }

      
      setData({
        ...data,
        data: data?.data?.map((x) => {
          if (x.id === tareaActualizada.id) return tareaActualizada;
          return x;
        }),
      });

    },
    [setData, data, currentRequest]
  );

  return {
    ...baseProps,
    fetchData,
    data,
    currentRequest,
    refresh,
    actualizarListaTareas,
  };
};

export const useCrearTarea = () => {
  const crearTarea = useCallback((request?: CrearTareaRequest) => {
    return tareaServices.crear(request);
  }, []);

  return useServices<CrearTareaResponse, CrearTareaRequest>({
    method: crearTarea,
  });
};

export const useActualizarTarea = () => {
  const actualizarTarea = useCallback((request?: ActualizarTareaRequest) => {
    if (!request?.id) {
      throw new Error("Ocurrió un error al intentar actualizar la tarea");
    }
    return tareaServices.actualizar(request);
  }, []);

  return useServices<ActualizarTareaResponse, ActualizarTareaRequest>({
    method: actualizarTarea,
  });
};

export const useEliminarTarea = () => {
  const eliminarTarea = useCallback((request?: EliminarTareaRequest) => {
    if (!request) {
      throw new Error("Ocurrió un error al intentar eliminar la tarea");
    }
    return tareaServices.eliminar(request);
  }, []);

  return useServices<EliminarTareaResponse, EliminarTareaRequest>({
    method: eliminarTarea,
  });
};
