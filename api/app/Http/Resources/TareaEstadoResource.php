<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TareaEstadoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'hexColor' => $this->hex_color,
        ];
    }
}
