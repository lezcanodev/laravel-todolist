import {
  useActualizarTarea,
  useEliminarTarea,
} from "../resources/Tarea/hooks/tarea.hooks";
import { Tarea as TareaModel } from "../resources/Tarea/models/Tarea.model";
import {
  ListadoTareaEstadoResponse,
  TareaEstado,
} from "../resources/TareaEstado/models/TareaEstado.model";
import { FormTarea } from "./FormTarea";
import { Tarea } from "./Tarea";
import { useCallback, useState } from "react";

interface ListadoTareasProps {
  tareas: TareaModel[];
  loading: boolean;
  refreshListadoTareas: () => void;
  actualizarListaTareas: (tareaActualizada: TareaModel) => void;
  tareaEstados: ListadoTareaEstadoResponse | null;
}
export function ListadoTareas({
  tareas,
  loading,
  refreshListadoTareas,
  actualizarListaTareas,
  tareaEstados,
}: ListadoTareasProps) {
  const { fetchData: eliminarTarea } = useEliminarTarea();
  const { fetchData: actualizarTarea } = useActualizarTarea();
  const [openActualizarTarea, setOpenActualizarTarea] =
    useState<TareaModel | null>(null);

  const handleEliminar = useCallback(
    async (tarea: TareaModel) => {
      await eliminarTarea({
        tareaId: tarea.id,
      });
      refreshListadoTareas();
    },
    [eliminarTarea, refreshListadoTareas]
  );

  const handleActualizar = useCallback(async (tarea: TareaModel) => {
    setOpenActualizarTarea(tarea);
  }, []);

  const handleCambiarEstado = useCallback(
    async (tarea: TareaModel, nuevoEstado: TareaEstado) => {
      await actualizarTarea({
        id: tarea.id,
        descripcion: tarea?.descripcion,
        fechaLimite: tarea?.fechaLimite,
        nombre: tarea?.nombre,
        tareaEstadoId: nuevoEstado.id,
      });
      actualizarListaTareas({
        ...tarea,
        estado: nuevoEstado,
      });
    },
    [actualizarTarea, actualizarListaTareas]
  );

  if (loading) {
    return <>Cargando tareas...</>;
  }

  if (!tareas || !tareas?.length) {
    return (
      <div className="text-center flex items-center justify-center min-h-[100px]">
        <h3 className="text-xl">No hay tareas para mostrar</h3>
      </div>
    );
  }

  return (
    <div>
      {/** Modal para editar tarea */}
      {!!openActualizarTarea && (
        <ModalFormTarea
          tareaEstados={tareaEstados}
          isOpen={!!openActualizarTarea}
          actualizarTarea={openActualizarTarea}
          onClose={() => {
            setOpenActualizarTarea(null);
          }}
          onSuccess={(tareaActualizada) => {
            actualizarListaTareas(tareaActualizada);
          }}
        />
      )}

      {/** Listado de tareas */}
      <div className="px-2 mt-1">
        {tareas?.map((tarea) => (
          <Tarea
            tarea={tarea}
            estados={tareaEstados?.data || []}
            onEliminar={handleEliminar}
            onActualizar={handleActualizar}
            onCambiarEstado={handleCambiarEstado}
            key={tarea.id}
          />
        ))}
      </div>
    </div>
  );
}

interface ModalFormTareaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tarea: TareaModel) => void;
  actualizarTarea: TareaModel;
  tareaEstados: ListadoTareaEstadoResponse | null;
}

function ModalFormTarea({
  isOpen,
  onClose,
  onSuccess,
  actualizarTarea,
  tareaEstados,
}: ModalFormTareaProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bg-secondary w-full xl:max-w-[50vw] sm:max-w-[80vw] max-w-[98vw] rounded-lg shadow-lg p-5 max-h-[98vh] overflow-auto">
            <div className="flex justify-between items-center mb-2 px-6">
              <h2 className="text-sm font-semibold">Editar tarea</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <FormTarea
              editarTarea={actualizarTarea}
              onClose={onClose}
              onSuccess={onSuccess}
              tareaEstados={tareaEstados}
            />
          </div>
        </div>
      )}
    </>
  );
}
