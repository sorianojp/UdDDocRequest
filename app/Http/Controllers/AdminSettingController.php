<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Setting;
use Inertia\Inertia;

class AdminSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'daily_request_limit' => Setting::get('daily_request_limit', 3),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'daily_request_limit' => 'required|integer|min:1|max:1000',
        ]);

        Setting::set('daily_request_limit', $validated['daily_request_limit']);

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
