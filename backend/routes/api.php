<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\LocalisationController;
use App\Http\Controllers\Api\OrganisateurController;
use App\Http\Controllers\Api\EvenementController;
use App\Http\Controllers\Api\InscriptionController;
use App\Http\Controllers\Api\ContactController;
use Illuminate\Support\Facades\Route;

// ── ROUTES PUBLIQUES

// Authentification
Route::post('/login', [AuthController::class, 'login'])->name('api.auth.login');

// Événements
Route::get('/evenements', [EvenementController::class, 'index'])->name('api.evenements.index');
Route::get('/evenements/{id}', [EvenementController::class, 'show'])->name('api.evenements.show');

// Catégories
Route::get('/categories', [CategorieController::class, 'index'])->name('api.categories.index');
Route::get('/categories/{id}', [CategorieController::class, 'show'])->name('api.categories.show');

// Localisations
Route::get('/localisations', [LocalisationController::class, 'index'])->name('api.localisations.index');
Route::get('/localisations/{id}', [LocalisationController::class, 'show'])->name('api.localisations.show');

// Inscriptions
Route::post('/inscriptions', [InscriptionController::class, 'store'])->name('api.inscriptions.store');
Route::get('/desinscription/{token}', [InscriptionController::class, 'desinscription'])->name('api.inscriptions.desinscription');

// Contact
Route::post('/contact', [ContactController::class, 'store'])->name('api.contact.store');

// ── ROUTES PRIVÉES (admin) 

Route::middleware('auth:sanctum')->group(function () {

    // Authentification
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.auth.logout');
    Route::get('/me', [AuthController::class, 'me'])->name('api.auth.me');

    // Catégories
    Route::post('/categories', [CategorieController::class, 'store'])->name('api.categories.store');
    Route::put('/categories/{id}', [CategorieController::class, 'update'])->name('api.categories.update');
    Route::delete('/categories/{id}', [CategorieController::class, 'destroy'])->name('api.categories.destroy');

    // Localisations
    Route::post('/localisations', [LocalisationController::class, 'store'])->name('api.localisations.store');
    Route::put('/localisations/{id}', [LocalisationController::class, 'update'])->name('api.localisations.update');
    Route::delete('/localisations/{id}', [LocalisationController::class, 'destroy'])->name('api.localisations.destroy');

    // Organisateurs
    Route::get('/organisateurs', [OrganisateurController::class, 'index'])->name('api.organisateurs.index');
    Route::get('/organisateurs/{id}', [OrganisateurController::class, 'show'])->name('api.organisateurs.show');
    Route::post('/organisateurs', [OrganisateurController::class, 'store'])->name('api.organisateurs.store');
    Route::put('/organisateurs/{id}', [OrganisateurController::class, 'update'])->name('api.organisateurs.update');
    Route::delete('/organisateurs/{id}', [OrganisateurController::class, 'destroy'])->name('api.organisateurs.destroy');

    // Événements
    Route::post('/evenements', [EvenementController::class, 'store'])->name('api.evenements.store');
    Route::put('/evenements/{id}', [EvenementController::class, 'update'])->name('api.evenements.update');
    Route::patch('/evenements/{id}/annuler', [EvenementController::class, 'annuler'])->name('api.evenements.annuler');
    Route::delete('/evenements/{id}', [EvenementController::class, 'destroy'])->name('api.evenements.destroy');

    // Inscriptions
    Route::get('/inscriptions', [InscriptionController::class, 'index'])->name('api.inscriptions.index');
    Route::get('/inscriptions/{id}', [InscriptionController::class, 'show'])->name('api.inscriptions.show');
    Route::delete('/inscriptions/{id}', [InscriptionController::class, 'destroy'])->name('api.inscriptions.destroy');
});
