<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Super Admin',
            'email' => 'admin@udd.edu.ph',
            'email_verified_at' => now(),
            'password' => 'Arcreactor2022!',
            'role' => 'super_admin',
        ]);
    }
}
