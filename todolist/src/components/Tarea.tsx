import { useMemo, useState } from "react";
import { Tarea as TareaModel } from "../resources/Tarea/models/Tarea.model";
import { Pencil, Trash2 } from "lucide-react";
import { TareaEstado } from "../resources/TareaEstado/models/TareaEstado.model";
import { TareaChecker } from "../resources/Tarea/utils/Tarea.checker";
import clsx from "clsx";
import { Loading } from "./Loading";

interface TareaProps {
  tarea: TareaModel;
  estados: TareaEstado[];
  onEliminar: (tarea: TareaModel) => Promise<void>;
  onActualizar: (tarea: TareaModel) => Promise<void>;
  onCambiarEstado: (
    tarea: TareaModel,
    nuevoEstadoId: TareaEstado
  ) => Promise<void>;
}
export function Tarea({
  tarea,
  estados,
  onActualizar,
  onCambiarEstado,
  onEliminar,
}: TareaProps) {
  const [loadingEliminar, setLoadingEliminar] = useState<boolean>(false);
  const [loadingNuevoEstado, setLoadingNuevoEstado] = useState<TareaEstado['id'] | null>(null);

  const fechaProcesada = useMemo<{
    fechaFormateada: string;
    diasFaltantes: number;
    color?: string;
  }>(() => {
    try {
      if (!tarea?.fechaLimite?.trim()?.length) throw new Error("");

      const fechaLimite = new Date(tarea.fechaLimite);
      const hoy = new Date();
      const colores = {
        rojo: "#f24141",
        amarillo: "#e6a225",
        verde: "#45b97d",
      };
      // 1. Formatear fecha legible
      const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(fechaLimite);

      // 2. Calcular días faltantes (sin horas/minutos)
      hoy.setHours(0, 0, 0, 0);
      fechaLimite.setHours(0, 0, 0, 0);

      const diffTime = fechaLimite.getTime() - hoy.getTime();
      const diasFaltantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        fechaFormateada, // Ej: "lunes, 15 de enero de 2024, 08:30 AM"
        diasFaltantes, // Ej: 5 (días restantes)
        color:
          diasFaltantes <= 0
            ? colores.rojo
            : diasFaltantes <= 5
            ? colores.amarillo
            : colores.verde,
      };
    } catch (error) {
      return {
        fechaFormateada: "",
        diasFaltantes: 0,
        error,
      };
    }
  }, [tarea.fechaLimite]);

  const handleEliminar = async () => {
    setLoadingEliminar(true);
    try {
      await onEliminar(tarea);
    } catch (error) {
      console.error("Error al eliminar la tarea", error);
      alert("No se pudo eliminar la tarea");
    } finally {
      setLoadingEliminar(false);
    }
  };

  const handleCambiarEstado = async (nuevoEstado: TareaEstado) => {
    setLoadingNuevoEstado(nuevoEstado.id);
    try {
      await onCambiarEstado(tarea, nuevoEstado);
    } catch (error) {
      console.error("Error al cambiar de estado la tarea", error);
      alert("No se pudo cambiar el estado de la tarea");
    } finally {
      setLoadingNuevoEstado(null);
    }
  };

  return (
    <div className="border p-2 rounded-md mb-2 bg-bg-secondary">
      {/** Cabecera */}
      <div>
        {/** nombre y estado */}
        <div className="flex justify-between flex-wrap">
          {/** Nombre */}
          <h3 className="font-bold">{tarea.nombre}</h3>

          {/** Estado */}
          <div
            style={{
              fontSize: ".75rem",
              color: tarea.estado.hexColor,
              background: tarea.estado.hexColor + "29",
            }}
            className="p-1 px-2 rounded-xl"
          >
            {tarea.estado.nombre}
          </div>
        </div>

        {/** fecha limite */}
        {fechaProcesada?.fechaFormateada ? (
          <>
            <div className="text-xs">
              Fecha Limite: {fechaProcesada?.fechaFormateada}
            </div>
            {!TareaChecker.estaCompleto(tarea) && (
              <div style={{ color: fechaProcesada?.color }} className="text-xs">
                Faltan: {fechaProcesada?.diasFaltantes} días
              </div>
            )}
          </>
        ) : (
          <div className="text-xs">{"<< sin fecha limite >>"}</div>
        )}
      </div>

      {/** descripción */}
      <div className="mt-1 border-l pl-1 max-h-[120px] overflow-auto">
        {(tarea?.descripcion || "").split("\n").map((linea, index) => (
          <p key={index}>{linea}</p>
        ))}
      </div>

      {/** Acciones */}
      <div className="flex justify-between items-center gap-4  mt-4 flex-wrap">
        <div className="flex gap-1 items-center flex-wrap">
          <div className="text-xs font-light">cambiar estado a</div>

          <div className="flex gap-2 flex-wrap">
            {estados?.map((estado) => {
              if (estado?.id === tarea.estado.id) return;

              return (
                <button
                  key={estado.id}
                  disabled={!!loadingNuevoEstado}
                  className={clsx(
                    "flex items-center rounded-lg px-2 py-[2px] text-xs cursor-pointer gap-1 "
                  )}
                  style={{
                    color: estado.hexColor,
                    background: estado.hexColor + "19",
                    fontSize: ".75rem",
                  }}
                  onClick={() => handleCambiarEstado(estado)}
                >
                  {!!(loadingNuevoEstado === estado.id) && (
                    <Loading size={".6rem"} />
                  )}

                  {estado.nombre}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end items-center gap-1 ml-auto">
          {/** Editar */}
          <div
            className="p-1 text-xs text-[#264fe2e6] bg-[#264fe257] rounded-md cursor-pointer
              hover:scale-95
              "
            onClick={() => onActualizar(tarea)}
          >
            <Pencil className="w-[20px] h-[20px]" />
          </div>

          {/** Eliminar */}
          <button
            disabled={loadingEliminar}
            className={clsx(`p-1 text-xs text-[#e22626e6] bg-[#e2262657] rounded-md cursor-pointer
                    hover:scale-95
                    `)}
            onClick={handleEliminar}
          >
            {loadingEliminar ? (
              <Loading />
            ) : (
              <Trash2 className="w-[20px] h-[20px]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
