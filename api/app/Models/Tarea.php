<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    protected $table = 'tareas';


    protected $fillable = [
        'nombre',
        'descripcion',
        'fecha_limite',
        'tarea_estado_id',
    ];

    protected $casts = [
        'fecha_limite' => 'datetime',
    ];

    public function estado()
    {
        return $this->belongsTo(TareaEstado::class, 'tarea_estado_id');
    }
}
