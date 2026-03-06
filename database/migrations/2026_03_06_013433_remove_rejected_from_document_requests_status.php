<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE document_requests MODIFY COLUMN status ENUM('PENDING', 'WAITING_FOR_PAYMENT', 'VERIFYING_PAYMENT', 'PROCESSING', 'DEFICIENT', 'READY', 'CLAIMED', 'CANCELLED') DEFAULT 'PENDING'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE document_requests MODIFY COLUMN status ENUM('PENDING', 'WAITING_FOR_PAYMENT', 'VERIFYING_PAYMENT', 'PROCESSING', 'DEFICIENT', 'READY', 'CLAIMED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING'");
    }
};
