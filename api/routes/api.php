<?php

use App\Http\Controllers\TareaController;
use App\Http\Controllers\TareaEstadoController;
use Illuminate\Support\Facades\Route;

Route::get('/estados', [TareaEstadoController::class, 'index']);

Route::prefix('/tareas')->group(function () {
    Route::apiResource('/', TareaController::class);
    Route::put('/{id}', [TareaController::class, 'update']);
    Route::delete('/{id}', [TareaController::class, 'delete']);
});
