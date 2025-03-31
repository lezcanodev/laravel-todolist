<?php

namespace App\Providers;

use App\Repositories\Interfaces\ITareaEstadoRepository;
use App\Repositories\Interfaces\ITareaRepository;
use App\Repositories\TareaEstadoRepository;
use App\Repositories\TareaRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ITareaRepository::class, TareaRepository::class);
        $this->app->bind(ITareaEstadoRepository::class, TareaEstadoRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
