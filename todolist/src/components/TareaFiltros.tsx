import { useEffect, useState } from "react";
import { ListadoTareaRequest } from "../resources/Tarea/models/ListadoTarea/listadoTarea.request";
import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react";
import {
  ListadoTareaEstadoResponse,
  TareaEstado,
} from "../resources/TareaEstado/models/TareaEstado.model";
import clsx from "clsx";

interface TareaFiltrosBlockProps {
  applyFiltro: (filtros: ListadoTareaRequest) => void;
  currentRequest: ListadoTareaRequest;
  tareaEstados: ListadoTareaEstadoResponse | null;
}
export function TareaFiltrosBlock({
  applyFiltro,
  currentRequest,
  tareaEstados,
}: TareaFiltrosBlockProps) {
  const [busquedaNombre, setBusquedaNombre] = useState<string>("");

  const handleOrdenamiento = (
    field: string,
    direction: "ASC" | "DESC" | null
  ) => {
    let newOrder = [...(currentRequest?.orderBy || [])];

    if (direction === null) {
      newOrder = newOrder.filter(
        (orderField) => !orderField?.startsWith(field)
      );
    } else {
      let exists = false;

      newOrder = newOrder.map((orderField) => {
        if (orderField?.startsWith(field)) {
          exists = true;
          return `${field} ${direction}`;
        }
        return orderField;
      });

      if (!exists) {
        newOrder.push(`${field} ${direction}`);
      }
    }

    applyFiltro({
      orderBy: newOrder,
      page: 1,
    });
  };

  const handleFiltroEstado = (estado: TareaEstado | null) => {
    applyFiltro({
      tareaEstadoId: estado ? estado.id : undefined,
    });
  };

  useEffect(() => {
    const busquedaPorNombreTimeout = setTimeout(() => {
      const currentBusqueda = currentRequest?.nombre?.trim() || "";
      if (busquedaNombre?.trim() == currentBusqueda) return;

      applyFiltro({
        nombre: busquedaNombre?.trim(),
        page: 1,
      });
    }, 500);

    return () => clearTimeout(busquedaPorNombreTimeout);
  }, [busquedaNombre, currentRequest]);

  return (
    <div className="bg-bg-secondary p-2 border rounded-md mb-8 mt-2">
      {/** Filtros de búsqueda y estado */}
      <div className="px-2">
        {/** Filtro de búsqueda */}
        <div className="flex gap-3 px-1">
          <input
            type="text"
            placeholder="Buscar tarea por nombre..."
            className="w-full border outline-none px-2 py-1 rounded-lg"
            onChange={(e) => setBusquedaNombre(e.target.value || "")}
          />
        </div>

        {/** Filtros de estado */}
        <div className="flex gap-2 flex-wrap mt-1 px-2">
          <button
            onClick={() => handleFiltroEstado(null)}
            className={clsx(
              "flex items-center rounded-lg px-2 py-[2px] text-xs cursor-pointer gap-1 "
            )}
            style={{
              color: "#423c3c",
              border: `1px solid #88828218`,
              background: !currentRequest?.tareaEstadoId ? '#88828218' : undefined,
              fontSize: ".75rem",
            }}
          >
            Todos
          </button>
          {tareaEstados?.data?.map((estado) => {
            return (
              <button
                key={estado.id}
                className={clsx(
                  "flex items-center rounded-lg px-2 py-[2px] text-xs cursor-pointer gap-1 ",
                  "backdrop-invert-0"
                )}
                style={{
                  color: estado.hexColor,
                  border: `1px solid ${estado.hexColor + "19"}`,
                  background: currentRequest?.tareaEstadoId === estado.id ? estado.hexColor + "19" : undefined,
                  fontSize: ".75rem",
                }}
                onClick={() => handleFiltroEstado(estado)}
              >
                {estado.nombre}
              </button>
            );
          })}
        </div>
      </div>

      {/** ordenamiento */}
      <div className="px-2">
        <div className="mb-1 mt-2">
          <p className="text-xs font-light">ordenar por</p>
        </div>
        <div className="flex gap-3 px-1">
          <SortByField
            fieldName="createdAt"
            label="Creación"
            value="DESC"
            onChange={handleOrdenamiento}
          />
          <SortByField
            fieldName="fechaLimite"
            label="Fecha limite"
            onChange={handleOrdenamiento}
          />
          <SortByField
            fieldName="nombre"
            label="Nombre"
            onChange={handleOrdenamiento}
          />
        </div>
      </div>
    </div>
  );
}

interface SortByFieldProps {
  label: string;
  value?: "initial" | "ASC" | "DESC";
  fieldName: string;
  onChange: (field: string, direction: "ASC" | "DESC" | null) => void;
}

function SortByField({ label, value, fieldName, onChange }: SortByFieldProps) {
  const [sortState, setSortState] = useState<"initial" | "ASC" | "DESC">(
    value || "initial"
  );

  const handleClick = () => {
    let newState: typeof sortState;
    let sortDirection: "ASC" | "DESC" | null;

    // Ciclo de estados: initial → asc → desc → initial
    switch (sortState) {
      case "initial":
        newState = "ASC";
        sortDirection = "ASC";
        break;
      case "ASC":
        newState = "DESC";
        sortDirection = "DESC";
        break;
      default:
        newState = "initial";
        sortDirection = null;
    }

    setSortState(newState);
    onChange(fieldName, sortDirection);
  };

  return (
    <div
      className="flex items-center gap-1 cursor-pointer select-none"
      onClick={handleClick}
      title={`Ordenar por ${label}`}
    >
      <span className="text-sm font-medium">{label}</span>

      <div className="flex flex-col items-center">
        {sortState === "initial" && (
          <ArrowDownUp className="h-4 w-4 opacity-50 hover:opacity-100" />
        )}
        {sortState === "ASC" && <MoveUp className="h-4 w-4 text-primary" />}
        {sortState === "DESC" && <MoveDown className="h-4 w-4 text-primary" />}
      </div>
    </div>
  );
}
