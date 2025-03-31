<?php

namespace App\Http\Controllers;


use App\Http\Resources\TareaEstadoResource;
use App\Repositories\Interfaces\ITareaEstadoRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TareaEstadoController extends Controller
{
    private ITareaEstadoRepository $tareaEstadoRepository;

    public function __construct(ITareaEstadoRepository $tareaRepository)
    {
        $this->tareaEstadoRepository = $tareaRepository;
    }

    public function index(Request $request): JsonResponse
    {
        $estados = $this->tareaEstadoRepository->getAll();
        return response()->json(["data" => TareaEstadoResource::collection($estados)]);
    }
}
