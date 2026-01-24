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
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('student_id_number');
            $table->string('document_type');
            $table->enum('status', ['PENDING', 'PROCESSING', 'DEFICIENT', 'READY', 'CLAIMED'])->default('PENDING');
            $table->text('deficiency_remarks')->nullable();
            $table->dateTime('claiming_date')->nullable();
            $table->string('school_id_path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
