<?php

namespace App\Http\Requests;


class UpdateTareaRequest extends StoreTareaRequest
{
    public function validationData()
    {
        return array_merge($this->all(), ['id' => $this->route('id')]);
    }
    
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['id'] = ['required', 'numeric'];
        return $rules;
    }
}
