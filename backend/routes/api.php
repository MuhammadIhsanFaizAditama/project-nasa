<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleApiController;
use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\NasaApiController;

// Authentication routes
Route::post('/login', [AuthApiController::class, 'login']);

// Public routes
Route::get('/artikel', [ArticleApiController::class, 'index']);
Route::get('/artikel/{id}', [ArticleApiController::class, 'show']);
Route::get('/kategori', [CategoryApiController::class, 'index']);
Route::get('/apod', [NasaApiController::class, 'apod']);
Route::get('/nasa-search', [NasaApiController::class, 'search']);
Route::get('/nasa-asset/{nasaId}', [NasaApiController::class, 'asset']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthApiController::class, 'logout']);

    // Article CRUD
    Route::post('/artikel', [ArticleApiController::class, 'store']);
    Route::put('/artikel/{id}', [ArticleApiController::class, 'update']);
    Route::delete('/artikel/{id}', [ArticleApiController::class, 'destroy']);

    // Category CRUD
    Route::post('/kategori', [CategoryApiController::class, 'store']);
    Route::put('/kategori/{id}', [CategoryApiController::class, 'update']);
    Route::delete('/kategori/{id}', [CategoryApiController::class, 'destroy']);
});
