<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Crear la tabla tarea_estados
        Schema::create('tarea_estados', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('hex_color', 7);
        });

        // Crear la tabla tareas
        Schema::create('tareas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 45);
            $table->text('descripcion');
            $table->timestamp('fecha_limite');
            $table->timestamps();
            
            // Definir la clave foránea
            $table->unsignedBigInteger('tarea_estado_id');
            $table->foreign('tarea_estado_id')->references('id')->on('tarea_estados')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tareas');

        Schema::dropIfExists('tarea_estados');
    }
};
