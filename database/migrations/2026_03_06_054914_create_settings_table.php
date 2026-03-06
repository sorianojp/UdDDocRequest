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
        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->text('value')->nullable();
                $table->timestamps();
            });
        }
        
        // Add a default limit so the feature works out-of-the-box
        // Only insert if it doesn't already exist
        if (!\Illuminate\Support\Facades\DB::table('settings')->where('key', 'daily_request_limit')->exists()) {
            \Illuminate\Support\Facades\DB::table('settings')->insert([
                'key' => 'daily_request_limit',
                'value' => '3',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
