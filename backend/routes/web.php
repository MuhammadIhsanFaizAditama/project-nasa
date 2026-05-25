<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SoapController;

// Fallback or API Greeting page
Route::get('/', function () {
    return response()->json([
        'name' => 'Sistem Edukasi Astronomi API Backend',
        'status' => 'online',
        'message' => 'Silakan gunakan React frontend untuk berinteraksi dengan sistem ini.'
    ]);
});

// Single endpoint for SOAP service
Route::any('soap-service', [SoapController::class, 'handle'])->name('soap.service');
