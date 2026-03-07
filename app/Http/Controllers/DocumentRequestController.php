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
        $dailyLimit = \App\Models\Setting::get('daily_request_limit', 3);
        $todayRequestsCount = DocumentRequest::whereDate('created_at', today())->count();

        return Inertia::render('services/request-form', [
            'pricing' => config('document_pricing.documents', []),
            'courses' => config('courses.list', []),
            'dailyLimit' => (int) $dailyLimit,
            'todayRequestsCount' => $todayRequestsCount,
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
            'address' => 'required|string|max:255',
            'birthdate' => 'required|date',
            'birthplace' => 'required|string|max:255',
            'higschool' => 'nullable|string|max:255',
            'hs_grad_year' => 'nullable|string|max:255',
            'prev_school' => 'nullable|string|max:255',
            'course' => 'required|string|max:255',
            'student_type' => 'required|string|in:Freshman,Transferee,Postgraduate',
            'document_types' => 'required|array|min:1',
            'document_types.*' => 'string',
            'purposes' => 'required|array',
            'purposes.*' => 'required|string|max:1000',
            'otr_copy' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'form_137' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        // Custom conditional validation for prev_school
        if (in_array($validated['student_type'], ['Transferee', 'Postgraduate']) && empty($validated['prev_school'])) {
            return back()->withErrors(['prev_school' => 'The previous school field is required for ' . $validated['student_type'] . ' students.'])->withInput();
        }

        // Check global daily request limit
        $dailyLimit = \App\Models\Setting::get('daily_request_limit', 3);
        $todayRequestsCount = DocumentRequest::whereDate('created_at', today())->count();
            
        if ($todayRequestsCount >= $dailyLimit) {
            return back()->withErrors([
                'submit_limit' => "The daily limit of {$dailyLimit} total document requests has been reached. Please try again tomorrow."
            ]);
        }

        // Prevent duplicate requests: Check if there's an active request with the exact same documents
        $activeStatuses = ['PENDING', 'WAITING_FOR_PAYMENT', 'VERIFYING_PAYMENT', 'PROCESSING'];
        $existingRequests = DocumentRequest::with('items')
            ->where('student_id_number', $validated['student_id_number'])
            ->whereIn('status', $activeStatuses)
            ->get();

        foreach ($existingRequests as $existingRequest) {
            $existingTypes = $existingRequest->items->pluck('document_type')->toArray();
            
            $requestedTypes = array_map(function($type) use ($documents) {
                return $documents[$type]['label'] ?? $type;
            }, $validated['document_types']);

            sort($existingTypes);
            sort($requestedTypes);

            if ($existingTypes === $requestedTypes) {
                return back()->withErrors(['document_types' => 'You already have an active request for these exact documents. Please wait for it to be processed.']);
            }
        }

        // File initializations
        $otrCopyPath = null;
        if ($request->hasFile('otr_copy')) {
            $otrCopyPath = $request->file('otr_copy')->store('student_documents', 'public');
        }

        $form137Path = null;
        if ($request->hasFile('form_137')) {
            $form137Path = $request->file('form_137')->store('student_documents', 'public');
        }

        // Create the main request (summary style for document_type)
        $documentRequest = DocumentRequest::create([
            'last_name' => $validated['last_name'],
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'email' => $validated['email'],
            'mobile_number' => $validated['mobile_number'],
            'student_id_number' => $validated['student_id_number'],
            'address' => $validated['address'],
            'birthdate' => $validated['birthdate'],
            'birthplace' => $validated['birthplace'],
            'higschool' => $validated['higschool'] ?? null,
            'hs_grad_year' => $validated['hs_grad_year'] ?? null,
            'prev_school' => $validated['student_type'] === 'Freshman' ? null : ($validated['prev_school'] ?? null),
            'course' => $validated['course'],
            'student_type' => $validated['student_type'],
            'document_type' => count($validated['document_types']) > 1 
                ? 'Multiple Documents' 
                : $documents[$validated['document_types'][0]]['label'] ?? $validated['document_types'][0],
            'school_id_path' => 'N/A',
            'otr_copy_path' => $otrCopyPath,
            'form_137_path' => $form137Path,
        ]);

        // Create items
        // Create items
        foreach ($validated['document_types'] as $type) {
            $documentRequest->items()->create([
                'document_type' => $documents[$type]['label'] ?? $type,
                'purpose' => $validated['purposes'][$type] ?? null,
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

        $documentRequest = DocumentRequest::with(['payment', 'items', 'handler'])->where('reference_number', $request->reference_number)->firstOrFail();

        return Inertia::render('services/track-result', [
            'request' => $documentRequest,
        ]);
    }

    public function showStatus($reference_number)
    {
        $documentRequest = DocumentRequest::with(['payment', 'items', 'handler'])->where('reference_number', $reference_number)->firstOrFail();

        return Inertia::render('services/track-result', [
            'request' => $documentRequest,
        ]);
    }

    public function index(Request $request, $status = null)
    {
        $query = DocumentRequest::with('handler');

        if ($status) {
            $normalizedStatus = strtoupper($status);
            $query->where('status', $normalizedStatus);
        } elseif ($request->filled('status') && $request->status !== 'ALL') {
             $query->where('status', $request->status);
        }

        if ($request->filled('category') && $request->category !== 'ALL') {
            $coursesConfig = config('courses.list', []);
            $categories = array_keys($coursesConfig);
            
            // Validate that the requested category exists in the config
            if (in_array($request->category, $categories)) {
                $coursesInCategory = $coursesConfig[$request->category] ?? [];
                
                // If a specific course is also filled, ensure it belongs to this category
                if ($request->filled('course') && $request->course !== 'ALL') {
                    if (in_array($request->course, $coursesInCategory)) {
                        $query->where('course', $request->course);
                    } else {
                        // Edge case: someone filtered category UG but specific course is PG. Should return 0.
                        $query->where('course', 'INVALID_COURSE_PREVENTION'); 
                    }
                } else {
                    // Filter by all courses in this category
                    $query->whereIn('course', $coursesInCategory);
                }
            }
        } elseif ($request->filled('course') && $request->course !== 'ALL') {
            $query->where('course', $request->course);
        }

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('reference_number', 'like', '%' . $request->search . '%')
                  ->orWhere('student_id_number', 'like', '%' . $request->search . '%')
                  ->orWhere('last_name', 'like', '%' . $request->search . '%')
                  ->orWhere('mobile_number', 'like', '%' . $request->search . '%');
            });
        }

        $requests = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('registrar/dashboard', [
            'requests' => $requests,
            'courses' => config('courses.list', []),
            'filters' => [
                'status' => $status ? strtoupper($status) : ($request->status ?? null),
                'search' => $request->search,
                'course' => $request->course,
                'category' => $request->category,
            ],
        ]);
    }

    public function show($id)
    {
        $request = DocumentRequest::with(['payment', 'items', 'handler'])->findOrFail($id);
        
        return Inertia::render('registrar/request-details', [
            'request' => $request,
            'deficiencies' => config('deficiencies.list', []),
        ]);
    }

    public function update(Request $request, $id)
    {
        $documentRequest = DocumentRequest::findOrFail($id);

        if (!$documentRequest->handled_by) {
            $documentRequest->update(['handled_by' => auth()->id()]);
        } elseif ($documentRequest->handled_by !== auth()->id()) {
            abort(403, 'Another registrar is already managing this request.');
        }

        $validated = $request->validate([
            'status' => 'required|in:PENDING,WAITING_FOR_PAYMENT,VERIFYING_PAYMENT,PROCESSING,DEFICIENT,READY,CLAIMED,CANCELLED',
            'deficiency_remarks' => 'nullable|required_if:status,DEFICIENT|string',
            'deficiency_pic' => 'nullable|image|max:5120',
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
        
        if ($validated['status'] === 'DEFICIENT') {
            if ($request->hasFile('deficiency_pic')) {
                // Delete old picture if exists
                if ($documentRequest->deficiency_pic) {
                    Storage::disk('public')->delete($documentRequest->deficiency_pic);
                }
                $updateData['deficiency_pic'] = $request->file('deficiency_pic')->store('deficiencies', 'public');
            }
        } else {
            // Nullify picture when status is no longer deficient
            $updateData['deficiency_pic'] = null;
        }

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

    public function printStub($reference_number)
    {
        $documentRequest = DocumentRequest::with(['payment', 'items', 'handler'])->where('reference_number', $reference_number)->firstOrFail();

        if ($documentRequest->status !== 'READY' && $documentRequest->status !== 'CLAIMED') {
            abort(403, 'Claim stub is only available for ready or claimed requests.');
        }

        return view('services.print-stub', [
            'request' => $documentRequest,
        ]);
    }

    public function quickClaim(Request $request)
    {
        // Normalize input to uppercase before validation
        if ($request->has('reference_number')) {
            $request->merge(['reference_number' => strtoupper($request->reference_number)]);
        }

        $validated = $request->validate([
            'reference_number' => 'required|string|exists:document_requests,reference_number',
        ]);

        $documentRequest = DocumentRequest::where('reference_number', $validated['reference_number'])->first();

        if ($documentRequest->status === 'CLAIMED') {
            return redirect()->back()->with('error', 'Request is already claimed.');
        }

        // Optional: specific statuses only? For flexibility, we might allow any status, 
        // but typically it should be READY. The prompt implies a direct action. 
        // Let's restrict to READY or PROCESSING to be safe, or just READY.
        // Prompt says "student present the claim stub... enter the req number then the status will be claimed".
        // Usually claim stub is given when READY. 
        if ($documentRequest->status !== 'READY') {
             return redirect()->back()->with('error', 'Request is not yet marked as READY. Current status: ' . $documentRequest->status);
        }

        $documentRequest->update([
            'status' => 'CLAIMED',
            'claiming_date' => now(), // Ensure claiming date is set/preserved
        ]);

        return redirect()->back()->with('success', 'Request ' . $documentRequest->reference_number . ' marked as CLAIMED.');
    }

    public function cancel($id)
    {
        $documentRequest = DocumentRequest::findOrFail($id);

        if ($documentRequest->status !== 'PENDING') {
            return redirect()->back()->with('error', 'Only pending requests can be cancelled.');
        }

        $documentRequest->update([
            'status' => 'CANCELLED',
        ]);

        return redirect()->back()->with('success', 'Request cancelled successfully.');
    }
}
