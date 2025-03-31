import { FormEvent, useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import { CircleChevronRight } from "lucide-react";
import {
  useActualizarTarea,
  useCrearTarea,
} from "../resources/Tarea/hooks/tarea.hooks";
import { Tarea } from "../resources/Tarea/models/Tarea.model";
import { ListadoTareaEstadoResponse } from '../resources/TareaEstado/models/TareaEstado.model';

const MAX_NOMBRE_TAREA_LENGTH = 45;

interface FormTareaData {
  nombre: string;
  fechaLimite: string;
  horaLimite: string;
  descripcion: string;
  tareaEstadoId: number;
}

interface FormTareaProps {
  refreshListadoTareas?: () => void;
  onClose?: () => void;
  onSuccess?: (tarea: Tarea) => void;
  editarTarea?: Tarea;
  tareaEstados: ListadoTareaEstadoResponse | null;
}

export function FormTarea({
  refreshListadoTareas,
  editarTarea,
  onSuccess,
  onClose,
  tareaEstados,
}: FormTareaProps) {
  // services hooks
  const { fetchData: crearTarea, loading: loadingCrearTarea } = useCrearTarea();
  const { fetchData: actualizarTarea, loading: loadingActualizarTarea } =
    useActualizarTarea();

  // memos
  const fechaLimiteFormateada = useMemo<{
    inputDateValue: string;
    inputTimeValue: string;
  } | null>(() => {
    if (!editarTarea) return null;

    try {
      // Crear fecha en UTC
      const fechaUTC = new Date(editarTarea.fechaLimite);

      // Formatear fecha (YYYY-MM-DD) para input type="date"
      const inputDateValue = `${fechaUTC.getFullYear()}-${(
        fechaUTC.getMonth() + 1
      )
        ?.toString()
        ?.padStart(2, "0")}-${fechaUTC
        .getDate()
        ?.toString()
        ?.padStart(2, "0")}`;

      // Formatear hora (HH:MM) para input type="time"
      const horas = String(fechaUTC.getHours()).padStart(2, "0");
      const minutos = String(fechaUTC.getMinutes()).padStart(2, "0");
      const inputTimeValue = `${horas}:${minutos}`;

      return { inputDateValue, inputTimeValue };
    } catch (error) {
      console.error("Error al formatear fecha límite:", error);
      return null;
    }
  }, [editarTarea]);

  // states
  const [showForm, setShowForm] = useState<boolean>(false);
  const [erroresForm, setErroresForm] =
    useState<{ [k in keyof FormTareaData]?: string }>();

  const loading = loadingCrearTarea || loadingActualizarTarea;

  const handleClose = () => {
    setErroresForm({});
    if (onClose) onClose();
  };

  const toggleForm = () => {
    if (!showForm == false) {
      handleClose();
    }
    setShowForm(!showForm);
  };

  const handleCrearTarea = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const formValues = Object.fromEntries(formData.entries());
      const tareaData: FormTareaData = {
        nombre: formValues?.nombre?.toString()?.trim(),
        fechaLimite: formValues?.fechaLimite?.toString()?.trim(),
        horaLimite: formValues?.horaLimite?.toString()?.trim(),
        descripcion: formValues?.descripcion?.toString()?.trim(),
        tareaEstadoId: parseInt(formValues?.tareaEstado?.toString()),
      };

      if (!validarForm(tareaData)) {
        return;
      }

      const tiempoLimite = `${tareaData.fechaLimite}T${
        tareaData?.horaLimite || "00:00"
      }:00`;

      const tiempoLimiteISO = new Date(tiempoLimite)?.toISOString();

      const baseData = {
        nombre: tareaData.nombre,
        descripcion: tareaData?.descripcion,
        fechaLimite: tiempoLimiteISO,
        tareaEstadoId: tareaData?.tareaEstadoId,
      };

      if (editarTarea) {
        const data = {
          ...baseData,
          id: editarTarea.id,
        };
        await actualizarTarea(data);
        if (onSuccess && editarTarea && Array.isArray(tareaEstados?.data)) {
          const nuevoEstado = tareaEstados.data.find(
            (x) => x.id === baseData.tareaEstadoId
          );
          if (nuevoEstado) {
            onSuccess({
              id: editarTarea.id,
              nombre: baseData.nombre,
              fechaLimite: baseData?.fechaLimite,
              fechaCreacion: editarTarea?.fechaCreacion,
              descripcion: baseData?.descripcion,
              estado: nuevoEstado,
            });
            if (onClose) onClose();
          }
        }
      } else {
        await crearTarea(baseData);
      }

      toggleForm();

      if (typeof refreshListadoTareas === "function") {
        refreshListadoTareas();
      }
    } catch (error) {
      alert("Ocurrió un error al crear la tarea.");
      console.error(error);
    }
  };

  const validarForm = useCallback((tareaData: FormTareaData): boolean => {
    const errores: { [k in keyof FormTareaData]?: string } = {};

    if (!tareaData.nombre) {
      errores.nombre = "El nombre es obligatorio.";
    } else if (tareaData.nombre.length > MAX_NOMBRE_TAREA_LENGTH) {
      errores.nombre = "El nombre no puede tener más de 15 caracteres.";
    }
    if (!tareaData.fechaLimite) {
      errores.fechaLimite = "La fecha límite es obligatoria.";
    }
    if (!tareaData.descripcion) {
      errores.descripcion = "La descripción es obligatoria.";
    }
    if (!tareaData.tareaEstadoId || isNaN(tareaData.tareaEstadoId)) {
      errores.tareaEstadoId = "El estado de la tarea es obligatorio.";
    }

    setErroresForm(errores);

    return Object.keys(errores).length === 0;
  }, []);

  return (
    <div className="">
      {/** Titulo */}
      {!editarTarea && (
        <div
          onClick={toggleForm}
          className="cursor-pointer flex justify-between opacity-55 hover:opacity-100"
        >
          <h3>Crear nueva tarea</h3>
          <div className={clsx(showForm && "rotate-90")}>
            <CircleChevronRight />
          </div>
        </div>
      )}

      {/** Formulario para crear tarea */}
      {!!(showForm || !!editarTarea) && (
        <div className="mt-5">
          <form onSubmit={handleCrearTarea}>
            <div className="flex flex-col gap-2">
              <div>
                {/** Titulo */}
                <div>
                  <label htmlFor="inp-nombre">Titulo</label>
                  <input
                    id="inp-nombre"
                    name="nombre"
                    defaultValue={editarTarea?.nombre || ""}
                    maxLength={MAX_NOMBRE_TAREA_LENGTH}
                    type="text"
                    style={{
                      outline: "none",
                    }}
                    className="border p-1 w-full"
                  />
                  <span className="text-red-500 text-xs">
                    {erroresForm?.nombre}
                  </span>
                </div>

                {/** Tiempo limite */}
                <div>
                  <label htmlFor="inp-nombre">Tiempo Limite</label>

                  <div className="flex gap-1">
                    {/** fecha */}
                    <input
                      id="inp-nombre"
                      type="date"
                      name="fechaLimite"
                      defaultValue={fechaLimiteFormateada?.inputDateValue}
                      style={{
                        outline: "none",
                      }}
                      className="border p-1 w-full "
                    />

                    {/** hora */}
                    <input
                      id="inp-nombre"
                      type="time"
                      name="horaLimite"
                      defaultValue={fechaLimiteFormateada?.inputTimeValue}
                      style={{
                        outline: "none",
                      }}
                      className="border p-1 w-full flex-1"
                    />
                  </div>
                  <span className="text-red-500 text-xs">
                    {erroresForm?.fechaLimite}
                  </span>
                </div>
              </div>

              {/** Estado de la tarea */}
              <div>
                <div>
                  <label htmlFor="inp-nombre">Estado</label>
                  <div className="flex gap-2">
                    {tareaEstados?.data?.map((tareaEstado, index) => (
                      <div key={tareaEstado.id} className="flex items-center">
                        <input
                          id={`estado-${tareaEstado.id}`}
                          type="radio"
                          name="tareaEstado"
                          defaultChecked={
                            !!(editarTarea
                              ? editarTarea?.estado?.id === tareaEstado.id
                              : index === 0)
                          }
                          value={tareaEstado.id}
                        />
                        <label
                          htmlFor={`estado-${tareaEstado.id}`}
                          className={clsx(
                            "flex items-center",
                            "px-1 py-1 rounded-full cursor-pointer",
                            "hover:opacity-90"
                          )}
                        >
                          {tareaEstado.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/** Descripción */}
              <div>
                <label htmlFor="inp-descripcion">Descripción</label>
                <textarea
                  id="inp-descripcion"
                  name="descripcion"
                  rows={2}
                  style={{
                    outline: "none",
                  }}
                  className="border p-1 w-full"
                  defaultValue={editarTarea?.descripcion || ""}
                ></textarea>
                <span className="text-red-500 text-xs">
                  {erroresForm?.descripcion}
                </span>
              </div>

              <div className="flex justify-end">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      toggleForm();
                      if (onClose) onClose();
                    }}
                    disabled={loading}
                    className="bg-transparent text-red-500 px-4 pb-1 rounded-md"
                  >
                    cancelar
                  </button>
                </div>
                <div>
                  <button
                    disabled={loading}
                    className="bg-primary text-white px-4 pb-1 rounded-md"
                  >
                    {loading ? "guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
