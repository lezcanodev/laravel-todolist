<?php

namespace Database\Seeders;

use App\Models\TareaEstado;
use Illuminate\Database\Seeder;

class TareaEstadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TareaEstado::insert([
            [
                'nombre' => 'Pendiente',
                'hex_color' => '#ff0000', 
            ],
            [
                'nombre' => 'En Progreso',
                'hex_color' => '#ef6619',
            ],
            [
                'nombre' => 'Completado',
                'hex_color' => '#1ea31e',
            ],
        ]);
    }
}
