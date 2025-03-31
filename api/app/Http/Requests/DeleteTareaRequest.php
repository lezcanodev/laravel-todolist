<?php

namespace App\Http\Requests;


class DeleteTareaRequest extends BaseRequest
{
    public function validationData()
    {
        return array_merge($this->all(), ['id' => $this->route('id')]);
    }
    
    public function rules(): array
    {
        $rules = [];
        $rules['id'] = ['required', 'numeric'];
        return $rules;
    }
}
