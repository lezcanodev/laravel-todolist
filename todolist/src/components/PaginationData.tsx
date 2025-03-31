import { useMemo } from "react";
import { ListadoTareaRequest } from "../resources/Tarea/models/ListadoTarea/listadoTarea.request";
import { ListadoTareaResponse } from "../resources/Tarea/models/ListadoTarea/listadoTarea.response";
import {
    ChevronFirst,
    ChevronLast
} from "lucide-react";
import clsx from "clsx";


interface PaginationDataProps {
  applyFiltro: (filtros: ListadoTareaRequest) => void;
  meta: ListadoTareaResponse["meta"];
}
export function PaginationData({ applyFiltro, meta }: PaginationDataProps) {
  const { hasNextPage, hasPreviusPage } = useMemo(() => {
    return {
      hasNextPage: (meta?.currentPage || 0) + 1 <= meta?.totalPages,
      hasPreviusPage: (meta?.currentPage || 0) - 1 > 0,
    };
  }, [meta]);

  const handleChangePage = (nextPage: boolean) => {
    if (nextPage && hasNextPage) {
      applyFiltro({
        page: meta?.currentPage + 1,
      });
    } else if (!nextPage && hasPreviusPage) {
      applyFiltro({
        page: meta?.currentPage - 1,
      });
    }
  };

  if (meta?.totalCount === 0) {
    return;
  }

  return (
    <div className="flex justify-between mb-1 items-center">
      <div>
        {meta.totalCount} tareas, pag. {meta.currentPage} de {meta?.totalPages}
      </div>

      <div className="flex gap-1">
        <div
          className={clsx(
            "bg-bg-secondary p-2 rounded-md",
            hasPreviusPage ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          )}
          onClick={() => handleChangePage(false)}
        >
          <ChevronFirst />
        </div>
        <div
          className={clsx(
            "bg-bg-secondary p-2 rounded-md",
            hasNextPage ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          )}
          onClick={() => handleChangePage(true)}
        >
          <ChevronLast />
        </div>
      </div>
    </div>
  );
}
