<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DocumentRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DocumentRequestController extends Controller
{
    public function create()
    {
        return Inertia::render('services/request-form', [
            'pricing' => config('document_pricing.documents', []),
        ]);
    }

    public function store(Request $request)
    {
        $documents = config('document_pricing.documents', []);

        $validated = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'student_id_number' => 'required|string|max:255',
            'document_types' => 'required|array|min:1',
            'document_types.*' => 'string',
            'school_id' => 'required|file|image|max:10240', // 10MB max
        ]);

        $path = $request->file('school_id')->store('school_ids', 'public');

        // Create the main request (summary style for document_type)
        $documentRequest = DocumentRequest::create([
            'last_name' => $validated['last_name'],
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'student_id_number' => $validated['student_id_number'],
            'document_type' => count($validated['document_types']) > 1 
                ? 'Multiple Documents' 
                : $documents[$validated['document_types'][0]]['label'] ?? $validated['document_types'][0],
            'school_id_path' => $path,
        ]);

        // Create items
        foreach ($validated['document_types'] as $type) {
            $documentRequest->items()->create([
                'document_type' => $documents[$type]['label'] ?? $type,
                'price' => $documents[$type]['price'] ?? config('document_pricing.default_price', 100.00),
            ]);
        }

        return redirect()->route('request.show-status', ['reference_number' => $documentRequest->reference_number]);
    }

    public function success($reference_number)
    {
        $request = DocumentRequest::where('reference_number', $reference_number)->firstOrFail();
        
        return Inertia::render('services/request-success', [
            'request' => $request,
        ]);
    }

    public function track()
    {
        return Inertia::render('services/track-request');
    }

    public function checkStatus(Request $request)
    {
        $request->validate([
            'reference_number' => 'required|string|exists:document_requests,reference_number',
        ]);

        $documentRequest = DocumentRequest::with(['payment', 'items'])->where('reference_number', $request->reference_number)->firstOrFail();

        return Inertia::render('services/track-result', [
            'request' => $documentRequest,
        ]);
    }

    public function showStatus($reference_number)
    {
        $documentRequest = DocumentRequest::with(['payment', 'items'])->where('reference_number', $reference_number)->firstOrFail();

        return Inertia::render('services/track-result', [
            'request' => $documentRequest,
        ]);
    }

    public function index(Request $request)
    {
        $query = DocumentRequest::query();

        if ($request->has('status') && $request->status !== 'ALL') {
             $query->where('status', $request->status);
        }

        $requests = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('registrar/dashboard', [
            'requests' => $requests,
            'filters' => $request->only(['status']),
        ]);
    }

    public function show($id)
    {
        $request = DocumentRequest::with(['payment', 'items'])->findOrFail($id);
        
        return Inertia::render('registrar/request-details', [
            'request' => $request,
            'school_id_url' => Storage::url($request->school_id_path),
            'deficiencies' => \App\Models\Deficiency::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $documentRequest = DocumentRequest::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:PENDING,PROCESSING,DEFICIENT,READY,CLAIMED',
            'deficiency_remarks' => 'nullable|required_if:status,DEFICIENT|string',
            'claiming_date' => 'nullable|required_if:status,READY|date',
        ]);

        $documentRequest->update([
            'status' => $validated['status'],
            'deficiency_remarks' => $validated['status'] === 'DEFICIENT' ? $validated['deficiency_remarks'] : null,
            'claiming_date' => $validated['status'] === 'READY' ? $validated['claiming_date'] : null,
        ]);

        return redirect()->back();
    }
}
