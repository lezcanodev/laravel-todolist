
export interface TareaEstado{
    id: number;
    hexColor: string;
    nombre: string;
}

export interface ListadoTareaEstadoResponse{
    data: TareaEstado[]
}