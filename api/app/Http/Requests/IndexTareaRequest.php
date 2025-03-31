<?php

namespace App\Http\Requests;

use App\Rules\OrderByRule;

class IndexTareaRequest extends BaseRequest
{
    public const MAX_PAGE_SIZE = 50;

    /**
     * For Assigning default values
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'page' => (int)$this->input('page', 1),
            'pageSize' => (int)$this->input('pageSize', 10),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $validSortFields = [
            'fechaLimite',
            'nombre',
            'createdAt'
        ];

        return [
            'page' =>  ['numeric', 'min:1'],
            'pageSize' =>  ['numeric', 'min:1', ['max', self::MAX_PAGE_SIZE]],
            'nombre' =>  ['min:1', 'max:25'],
            'tareaEstadoId' => ['numeric'],
            'orderBy' => [new OrderByRule($validSortFields)]
        ];
    }
}
