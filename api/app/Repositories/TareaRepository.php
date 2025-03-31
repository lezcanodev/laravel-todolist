<?php

namespace App\Repositories;

use App\Models\Tarea;
use App\Repositories\Interfaces\ITareaRepository;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TareaRepository implements ITareaRepository
{
    public function getAll(array $filters): LengthAwarePaginator
    {
        $query = Tarea::query();
        $query->with('estado');
        if (array_key_exists('nombre', $filters)) {
            $query->where('nombre', 'LIKE', "%{$filters['nombre']}%");
        }

        if (array_key_exists('tareaEstadoId', $filters)) {
            $query->where('tarea_estado_id', $filters['tareaEstadoId']);
        }

        if (array_key_exists('orderBy', $filters)) {
            $mapColumnNames = [
                'fechaLimite' => 'fecha_limite',
                'createdAt' => 'created_at',
            ];
            foreach ($filters['orderBy'] as $order) {
                $orderParts = explode(' ', $order);
                [$fieldName, $sortDirection] = $orderParts;
                $query->orderBy($mapColumnNames[$fieldName] ?? $fieldName, $sortDirection);
            }
        }

        $pageSize = $filters['pageSize'];
        $page = $filters['page'];

        $paginatedResults = $query->paginate($pageSize, ['*'], 'page', $page);
        $paginatedResults->appends($filters);

        return  $paginatedResults;
    }

    public function store(array $data)
    {
        $newTarea = Tarea::create([
            'nombre' => $data['nombre'],
            'descripcion' => $data['descripcion'],
            'fecha_limite' => Carbon::parse($data['fechaLimite'])->setTimezone('UTC')->toDateTimeString(),
            'tarea_estado_id' => $data['tareaEstadoId'],
        ]);

        return $newTarea;
    }

    public function update(array $data)
    {
        $filasAfectadas = Tarea::where('id', $data['id'])->update([
            'nombre' => $data['nombre'],
            'descripcion' => $data['descripcion'],
            'fecha_limite' => Carbon::parse($data['fechaLimite'])->setTimezone('UTC')->toDateTimeString(),
            'tarea_estado_id' => $data['tareaEstadoId'],
        ]);

        return $filasAfectadas == 1;
    }

    public function delete(int $id)
    {
        $tareaDeleted = Tarea::where('id', $id)->delete();
        return $tareaDeleted;
    }
}
