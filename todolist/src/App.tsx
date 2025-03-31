import { useCallback, useEffect } from "react";
import { Header } from "./components/Header";
import "./index.css";
import { useListadoTareas } from "./resources/Tarea/hooks/tarea.hooks";
import { ListadoTareaRequest } from "./resources/Tarea/models/ListadoTarea/listadoTarea.request";
import { FormTarea } from "./components/FormTarea";
import { TareaFiltrosBlock } from "./components/TareaFiltros";
import { PaginationData } from "./components/PaginationData";
import { ListadoTareas } from "./components/ListadoTareas";
import { useListadoTareaEstados } from "./resources/TareaEstado/hooks/tareaEstado.hooks";

function App() {
  // hooks de servicios
  const {
    data,
    fetchData: fetchListadoTareas,
    loading,
    currentRequest,
    refresh: refreshListadoTareas,
    actualizarListaTareas,
  } = useListadoTareas();
  const { data: tareaEstados } = useListadoTareaEstados();

  const handleAplicarFiltros = useCallback(
    (filtros: ListadoTareaRequest) => {
      fetchListadoTareas({
        ...currentRequest,
        ...filtros,
      });
    },
    [currentRequest, fetchListadoTareas]
  );

  useEffect(() => {
    fetchListadoTareas({
      orderBy: ["createdAt DESC"],
      page: 1,
    });
  }, [fetchListadoTareas]);

  return (
    <>
      <div className="h-screen w-screen overflow-auto font-sans bg-bg-primary text-txt-primary">
        <div className="max-w-[680px] mx-auto px-1">
          <Header />

          {/** Crear tarea */}
          <div className="bg-bg-secondary border rounded-lg p-2 px-3">
            <FormTarea
              tareaEstados={tareaEstados}
              refreshListadoTareas={refreshListadoTareas}
            />
          </div>

          {/** Filtros para aplicar sobre listado tareas */}
          <TareaFiltrosBlock
            tareaEstados={tareaEstados}
            applyFiltro={handleAplicarFiltros}
            currentRequest={currentRequest}
          />

          {/** Paginacion */}
          {data?.meta && (
            <PaginationData
              applyFiltro={handleAplicarFiltros}
              meta={data?.meta}
            />
          )}

          {/** Tareas */}
          <ListadoTareas
            tareaEstados={tareaEstados}
            tareas={data?.data || []}
            loading={loading}
            refreshListadoTareas={refreshListadoTareas}
            actualizarListaTareas={actualizarListaTareas}
          />
        </div>
      </div>
    </>
  );
}

export default App;
