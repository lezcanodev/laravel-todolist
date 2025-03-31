<?php

namespace App\Repositories\Interfaces;

interface ITareaRepository
{
    public function getAll(array $filters);
    public function store(array $data);
    public function update(array $data);
    public function delete(int $id);
}
