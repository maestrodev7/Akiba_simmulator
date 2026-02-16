<?php

use App\Infrastructure\Http\Controller\Api\ClientController;
use Illuminate\Support\Facades\Route;

Route::apiResource('clients', ClientController::class);
