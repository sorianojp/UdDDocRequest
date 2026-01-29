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
Route::get('/track/{reference_number}', [DocumentRequestController::class, 'showStatus'])->name('request.show-status');

Route::get('/requests/{request}/payment', [App\Http\Controllers\PaymentController::class, 'show'])->name('request.payment');
Route::post('/requests/{request}/payment', [App\Http\Controllers\PaymentController::class, 'store'])->name('request.payment.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $counts = \App\Models\DocumentRequest::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('dashboard', [
            'counts' => $counts
        ]);
    })->name('dashboard');

    Route::prefix('registrar')->name('registrar.')->group(function () {
        Route::get('requests/{status?}', [DocumentRequestController::class, 'index'])
            ->name('index')
            ->where('status', '^(pending|processing|deficient|ready|claimed)$');
        Route::get('requests/{id}', [DocumentRequestController::class, 'show'])->name('show');
        Route::put('requests/{id}', [DocumentRequestController::class, 'update'])->name('update');
        Route::post('deficiencies', [\App\Http\Controllers\DeficiencyController::class, 'store'])->name('deficiencies.store');
        Route::put('payments/{payment}', [\App\Http\Controllers\PaymentController::class, 'update'])->name('payments.update');
    });
});

require __DIR__.'/settings.php';
