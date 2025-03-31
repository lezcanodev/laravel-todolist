<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TareaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'fechaLimite' => $this->fecha_limite,
            'descripcion' => $this->descripcion,
            'fechaCreacion' => $this->created_at,
            'estado' => new TareaEstadoResource($this->estado),
        ];
    }
}
