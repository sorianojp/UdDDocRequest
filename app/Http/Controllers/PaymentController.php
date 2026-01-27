<?php

namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function show(DocumentRequest $request)
    {
        return Inertia::render('services/payment', [
            'request' => $request->load('payment'),
            'amount' => $request->amount_due,
        ]);
    }

    public function store(Request $httpRequest, DocumentRequest $request)
    {
        $httpRequest->validate([
            'proof' => ['required', 'image', 'max:10240'], // 10MB
            'reference_number' => ['required', 'string', 'max:255'],
        ]);

        $path = $httpRequest->file('proof')->store('payments', 'public');

        $payment = Payment::updateOrCreate(
            ['document_request_id' => $request->id],
            [
                'reference_number' => 'PAY-' . strtoupper(uniqid()),
                'external_reference_number' => $httpRequest->reference_number,
                'amount' => $request->amount_due,
                'payment_method' => 'manual',
                'status' => 'pending',
                'proof_file_path' => $path,
                'paid_at' => null, // Pending verification
            ]
        );

        return back()->with('success', 'Payment proof uploaded successfully. Please wait for verification.');
    }

    public function update(Request $httpRequest, Payment $payment)
    {
        $httpRequest->validate([
            'status' => 'required|in:verified,rejected,pending',
        ]);

        $payment->update([
            'status' => $httpRequest->status,
            'paid_at' => $httpRequest->status === 'verified' ? now() : null,
        ]);

        return back()->with('success', 'Payment status updated.');
    }
}
