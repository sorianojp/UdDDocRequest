<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\DocumentRequestController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/request', [DocumentRequestController::class, 'create'])->name('request.create');
Route::post('/request', [DocumentRequestController::class, 'store'])->name('request.store');
Route::get('/request/success/{reference_number}', [DocumentRequestController::class, 'success'])->name('request.success');
Route::get('/track', [DocumentRequestController::class, 'track'])->name('request.track');
Route::post('/track', [DocumentRequestController::class, 'checkStatus'])->name('request.check-status');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('registrar')->name('registrar.')->group(function () {
        Route::get('requests', [DocumentRequestController::class, 'index'])->name('index');
        Route::get('requests/{id}', [DocumentRequestController::class, 'show'])->name('show');
        Route::put('requests/{id}', [DocumentRequestController::class, 'update'])->name('update');
    });
});

require __DIR__.'/settings.php';
