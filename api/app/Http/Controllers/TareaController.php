<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteTareaRequest;
use App\Http\Requests\IndexTareaRequest;
use App\Http\Requests\StoreTareaRequest;
use App\Http\Requests\UpdateTareaRequest;
use App\Http\Resources\PaginateResource;
use App\Http\Resources\TareaResource;
use App\Repositories\Interfaces\ITareaRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class TareaController extends Controller
{
    private ITareaRepository $tareaRepository;

    public function __construct(ITareaRepository $tareaRepository)
    {
        $this->tareaRepository = $tareaRepository;
    }

    public function index(IndexTareaRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $tareasResult = $this->tareaRepository->getAll($validated);
        return response()->json(new PaginateResource($tareasResult, TareaResource::class));
    }

    public function store(StoreTareaRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $nuevaTarea = $this->tareaRepository->store($validated);
        return response()->json(['data' => new TareaResource($nuevaTarea)], Response::HTTP_CREATED);
    }


    public function update(UpdateTareaRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $tarea = $this->tareaRepository->update($validated);
        return response()->json([], Response::HTTP_OK);
    }

    public function delete(DeleteTareaRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $tareaEliminada = $this->tareaRepository->delete($validated['id']);
        return response()->json(['data' => $tareaEliminada], Response::HTTP_OK);
    }
}
