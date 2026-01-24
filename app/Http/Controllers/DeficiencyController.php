<?php

namespace App\Http\Controllers;

use App\Models\Deficiency;
use Illuminate\Http\Request;

class DeficiencyController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:deficiencies,name',
        ]);

        Deficiency::create($validated);

        return redirect()->back();
    }
}
