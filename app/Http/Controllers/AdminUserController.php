<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = \App\Models\User::where('role', '!=', 'super_admin')->get();
        return \Inertia\Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => 'registrar',
        ]);

        return redirect()->back()->with('success', 'Registrar account created successfully.');
    }

    public function destroy(\App\Models\User $user)
    {
        if ($user->role === 'super_admin') {
            return redirect()->back()->with('error', 'Cannot delete super admin.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
