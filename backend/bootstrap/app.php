<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \App\Infrastructure\Http\Middleware\TrimStrings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\App\Domain\Exception\DomainException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                $errors = $e instanceof \App\Domain\Exception\ValidationException
                    ? $e->getErrors()
                    : null;
                return \App\Infrastructure\Http\ApiResponse::error(
                    $e->getMessage(),
                    $e->getHttpStatusCode(),
                    $errors
                );
            }
        });
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return \App\Infrastructure\Http\ApiResponse::error(
                    'Données invalides.',
                    422,
                    $e->errors()
                );
            }
        });
    })->create();
