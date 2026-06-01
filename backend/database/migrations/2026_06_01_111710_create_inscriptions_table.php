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
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evenement_id')->constrained('evenements')->onDelete('cascade');
            $table->string('nom_participant');
            $table->string('email_participant');
            $table->string('token_desinscription')->unique();
            $table->dateTime('inscrit_le')->useCurrent();
            $table->timestamps();
            $table->softDeletes();
            $table->index('email_participant');
            $table->index('evenement_id');
            $table->index('token_desinscription');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
