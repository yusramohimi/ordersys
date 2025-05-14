<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected function middleware(): array
    {
        return [
            \Illuminate\Http\Middleware\HandleCors::class,
        ];
    }

    protected function middlewareGroups(): array
    {
        return [
            'api' => [
                \Illuminate\Routing\Middleware\SubstituteBindings::class,
            ],
        ];
    }
}
