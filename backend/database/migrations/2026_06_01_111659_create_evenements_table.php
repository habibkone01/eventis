<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('evenements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('categorie_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('organisateur_id')->constrained('organisateurs')->onDelete('cascade');
            $table->foreignId('localisation_id')->constrained('localisations')->onDelete('cascade');
            $table->string('titre');
            $table->text('description')->nullable();
            $table->dateTime('date_debut');
            $table->dateTime('date_fin')->nullable();
            $table->string('lieu')->nullable();
            $table->integer('capacite_max')->nullable();
            $table->enum('statut', ['publie', 'annule', 'termine'])->default('publie');
            $table->string('image_url')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index('titre');
            $table->index('statut');
            $table->index('date_debut');
            $table->index('localisation_id');
            $table->index('categorie_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evenements');
    }
};
