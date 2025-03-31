<?php

namespace App\Http\Requests;

use App\Rules\DateISO8601;

class StoreTareaRequest extends BaseRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'nombre' =>  ['required', 'min:1', 'max:45'],
            'descripcion' => ['required', 'string'],
            'fechaLimite' => ['required', new DateISO8601],
            'tareaEstadoId' => ['required', 'exists:tarea_estados,id'],
        ];
    }
}
