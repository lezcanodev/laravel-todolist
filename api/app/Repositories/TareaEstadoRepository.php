<?php

namespace App\Repositories;

use App\Models\TareaEstado;
use App\Repositories\Interfaces\ITareaEstadoRepository;

class TareaEstadoRepository implements ITareaEstadoRepository
{
    public function getAll()
    {
        return  TareaEstado::all();
    }
}
