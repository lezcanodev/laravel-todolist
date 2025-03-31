<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TareaEstado extends Model
{
    protected $table = 'tarea_estados';

    public function tareas()
    {
        return $this->hasMany(Tarea::class, 'tarea_estado_id');
    }
}
