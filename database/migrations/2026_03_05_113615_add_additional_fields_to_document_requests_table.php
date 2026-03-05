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
        Schema::table('document_requests', function (Blueprint $table) {
            $table->string('address');
            $table->date('birthdate');
            $table->string('birthplace');
            $table->string('higschool');
            $table->string('hs_grad_year');
            $table->string('prev_school');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_requests', function (Blueprint $table) {
            $table->dropColumn(['address', 'birthdate', 'birthplace', 'higschool', 'hs_grad_year', 'prev_school']);
        });
    }
};
