<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class OrderByRule implements ValidationRule
{
    protected array $validSortFields;

    public function __construct(array $validSortFields)
    {
        $this->validSortFields = $validSortFields;
    }

    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  \Closure  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
    // Si $value es un array, iterar sobre cada elemento
    if (is_array($value)) {
        foreach ($value as $val) {
            // Validar que cada valor esté en el formato "columnName ASC|DESC"
            if (!preg_match('/^([a-zA-Z0-9_]+)\s(ASC|DESC)$/', $val, $matches)) {
                $fail("The $attribute format is invalid. It should be 'columnName ASC|DESC'.");
                return;
            }

            // Validar que el campo 'columnName' sea válido
            $columnName = $matches[1];
            if (!in_array($columnName, $this->validSortFields)) {
                $fail("The column name $columnName is not a valid sorting field.");
                return;
            }
        }
    } else {
        // Si no es un array, validamos solo un valor
        if (!preg_match('/^([a-zA-Z0-9_]+)\s(ASC|DESC)$/', $value, $matches)) {
            $fail("The $attribute format is invalid. It should be 'columnName ASC|DESC'.");
            return;
        }

        // Validar que el campo 'columnName' sea válido
        $columnName = $matches[1];
        if (!in_array($columnName, $this->validSortFields)) {
            $fail("The column name $columnName is not a valid sorting field.");
        }
    }
    }
}