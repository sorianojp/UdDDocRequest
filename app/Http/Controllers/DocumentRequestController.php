<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DocumentRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\DocumentRequestStatusUpdated;
use App\Mail\DocumentRequestSubmitted;

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
            'email' => 'required|email|max:255',
            'mobile_number' => 'required|string|max:20',
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
            'email' => $validated['email'],
            'mobile_number' => $validated['mobile_number'],
            'student_id_number' => $validated['student_id_number'],
            'document_type' => count($validated['document_types']) > 1 
                ? 'Multiple Documents' 
                : $documents[$validated['document_types'][0]]['label'] ?? $validated['document_types'][0],
            'school_id_path' => $path,
        ]);

        // Create items
        // Create items
        foreach ($validated['document_types'] as $type) {
            $documentRequest->items()->create([
                'document_type' => $documents[$type]['label'] ?? $type,
                'price' => 0.00, // Registrar sets this later
            ]);
        }


        // Send email notification
        if ($validated['email']) {
            Mail::to($validated['email'])->send(new DocumentRequestSubmitted($documentRequest));
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

    public function index(Request $request, $status = null)
    {
        $query = DocumentRequest::query();

        if ($status) {
            $normalizedStatus = strtoupper($status);
            $query->where('status', $normalizedStatus);
        } elseif ($request->has('status') && $request->status !== 'ALL') {
             $query->where('status', $request->status);
        }

        $requests = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('registrar/dashboard', [
            'requests' => $requests,
            'filters' => [
                'status' => $status ? strtoupper($status) : ($request->status ?? null),
            ],
        ]);
    }

    public function show($id)
    {
        $request = DocumentRequest::with(['payment', 'items'])->findOrFail($id);
        
        return Inertia::render('registrar/request-details', [
            'request' => $request,
            'school_id_url' => Storage::url($request->school_id_path),
            'deficiencies' => config('deficiencies.list', []),
        ]);
    }

    public function update(Request $request, $id)
    {
        $documentRequest = DocumentRequest::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:PENDING,WAITING_FOR_PAYMENT,VERIFYING_PAYMENT,PROCESSING,DEFICIENT,READY,CLAIMED,REJECTED',
            'deficiency_remarks' => 'nullable|required_if:status,DEFICIENT|string',
            'claiming_date' => 'nullable|required_if:status,READY|date',
            'items' => 'nullable|array',
            'items.*.id' => 'required|exists:request_items,id',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        // Update items prices if provided
        if (isset($validated['items'])) {
            foreach ($validated['items'] as $itemData) {
                // Ensure the item belongs to this request
                $item = $documentRequest->items()->where('id', $itemData['id'])->first();
                if ($item) {
                    $item->update(['price' => $itemData['price']]);
                }
            }
        }

        $updateData = [
            'status' => $validated['status'],
            'deficiency_remarks' => $validated['status'] === 'DEFICIENT' ? $validated['deficiency_remarks'] : null,
            'claimed_date' => $validated['status'] === 'CLAIMED' ? now() : null,
        ];

        // Only update claiming_date if status is READY (set it) or if status is NOT CLAIMED (clear it).
        // If status IS CLAIMED, we want to Keep the existing claiming_date.
        if ($validated['status'] === 'READY') {
            $updateData['claiming_date'] = $validated['claiming_date'];
        } elseif ($validated['status'] !== 'CLAIMED') {
            $updateData['claiming_date'] = null;
        }

        $documentRequest->update($updateData);

        // Send email notification
        if ($documentRequest->email) {
            Mail::to($documentRequest->email)->send(new DocumentRequestStatusUpdated($documentRequest));
        }

        return redirect()->back();
    }
}
